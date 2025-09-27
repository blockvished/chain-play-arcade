// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { GameRegistry } from "./GameFactory.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { SVGNFT } from "./Nft.sol";

contract GameHub is GameRegistry {

    uint256 public gameEventCount = 1;
    uint256 public constant LEADERBOARD_SIZE = 10;
    SVGNFT public svgNft;

    struct GameEvent {
        bool active;
        string eventName;
        uint256 startTime;
        uint256 endTime;
        uint256 referencedGameId;
        uint256 durationMinutes;
        uint256 minStakeAmt;
        uint256 pooledAmt;
        bool scoresFinalized;
        uint256 playersCount;
        uint256 winnersCount;
    }

    struct GameState {
        uint256 score;
        string cid;
        bool winner;
    }

    address public admin;
    uint256 public adminWithdrawAllowances; // admin gets fee based on GameEvent struct
    mapping(address => uint256) public winnerWithdrawAllowances;
    mapping (address => uint256) public rankOfWinner;

    mapping(uint256 gameEventId=> mapping(address => uint256)) public scores;
    mapping(uint256 gameEventId=> mapping(address => bool)) public joined;
    mapping(uint256 gameEventId=> address[LEADERBOARD_SIZE]) public topPlayers;
    mapping(uint256 gameEventId=> GameEvent) public gamesEvents;
    mapping(uint256 gameEventId=> mapping(address => GameState[])) public gameStates;

    event GameCreated(uint256 gameEventId, uint256 referencedGameId, string eventName, uint256 startTime, uint256 endTime, bool active, uint256 durationMinutes, uint256 minStakeAmount);
    event PlayerJoined(uint256 gameEventId, address player, uint256 pooledAmt, uint256 playersCount);
    event ScoresFinalized(uint256 gameEventId);
    event PrizeClaimed(address winner, uint256 amount);
    event AdminChanged(address newAdmin);
    event AdminWithdraw(address to, uint256 amount);

    error IncorrectStake(uint256 amountRequired, uint256 amoutSent);
    error AlreadyJoined(uint256 gameEventId, address player);

    error ScoresAlreadyFinalized(uint256 gameEventId);
    error GameStillRunning(uint256 gameEventId);
    error GameEnded(uint256 gameEventId);
    error GameEndedOR_Already_Active(uint256 gameEventId);
    error GameNotFound();
    error PlayerNotJoined();
    error GameAlreadyActive();
    error NotAdmin();
    error GameInactive();
    error ArrayLengthMismatch();
    error AdminWithdrawLimitExceeded();
    error WinnerCountNot_1_or_3();

    modifier onlyAdmin() {
        _onlyAdminorOwner();
        _;
    }

    function _onlyAdminorOwner() internal view {
        if (msg.sender != admin && msg.sender != owner()) {
            revert NotAdmin();
        }
    }

    // CONSTRUCTOR
    constructor(address initialAdmin) GameRegistry() {
        admin = initialAdmin;
        svgNft = new SVGNFT();
    }

    function setAdmin(address newAdmin) external onlyOwner {
        admin = newAdmin;
        emit AdminChanged(newAdmin);
    }

    // admin or owner can create the game event using id from game registry, and can specify duration minutes, minStakeAmt, and activate the game right away
    function createGameEvent(uint256 gameId, string calldata eventName, uint256 durationMinutes, uint256 minStakeAmt, uint256 winnersCount, bool activate) external onlyAdmin {
        require(durationMinutes > 10, "duration must be > 10 minutes");

        if (getGameDefinition(gameId).id == 0) {
            revert GameNotFound();
        }

        if (winnersCount != 1 && winnersCount != 3) {
            revert WinnerCountNot_1_or_3();
        }

        uint256 gameEventId = gameEventCount;
        GameEvent storage ge = gamesEvents[gameEventCount];

        uint256 startTime;
        uint256 endTime;

        if (activate) {
            startTime = block.timestamp;
            endTime = startTime + (durationMinutes * 1 minutes);
            ge.startTime = startTime;
            ge.endTime = endTime;
        } else {
            startTime = 0;
            endTime = 0;
        }

        ge.eventName = eventName;
        ge.referencedGameId = gameId;

        ge.active = activate;
        ge.durationMinutes = durationMinutes;
        ge.minStakeAmt = minStakeAmt;
        ge.winnersCount = winnersCount;
        ge.scoresFinalized = false;

        gameEventCount += 1;

        emit GameCreated(gameEventId, gameId, eventName, startTime, endTime, activate, durationMinutes, minStakeAmt);
    }

    // player can join the game event before it is started but is created, but not after it is ended
    function joinGame(uint256 gameEventId) external payable {
        GameEvent storage ge = gamesEvents[gameEventId];
        if (block.timestamp > ge.endTime) revert GameEnded(gameEventId);
        if (joined[gameEventId][msg.sender]) revert AlreadyJoined(gameEventId, msg.sender);

        if (msg.value != ge.minStakeAmt) revert IncorrectStake(ge.minStakeAmt, msg.value);

        ge.pooledAmt += msg.value;

        joined[gameEventId][msg.sender] = true;
        ge.playersCount += 1;

        emit PlayerJoined(gameEventId, msg.sender, ge.pooledAmt, ge.playersCount);
    }

    // if game is inactive then it can be activated
    function activateGame(uint256 gameEventId) external onlyAdmin {
        GameEvent storage ge = gamesEvents[gameEventId];
        if (ge.active) revert GameAlreadyActive();
        if (ge.endTime != 0) revert GameEndedOR_Already_Active(gameEventId);
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + (ge.durationMinutes * 1 minutes);
        ge.startTime = startTime;
        ge.endTime = endTime;
        ge.active = true;
    }

    // NOTE: admin/owner should send the scores in descending order but correctly matched to correct players
    // e.g. players = [<address_of_100_scorer>, <address_of_90_scorer>, <address_of_50_scorer>, <address_of_20_scorer>];
    // e.g. finalScores = [100,90,50,20]
    function finalizeScores(uint256 gameEventId, address[] calldata players, uint256[] calldata finalScores, bool noWinner) external onlyOwner {
        GameEvent storage ge = gamesEvents[gameEventId];

        if (!(players.length == finalScores.length)) {
            revert ArrayLengthMismatch();
        }

        if (block.timestamp <= ge.endTime) revert GameStillRunning(gameEventId);
        if (ge.scoresFinalized) revert ScoresAlreadyFinalized(gameEventId);

        address[LEADERBOARD_SIZE] memory leaderboard;

        for (uint256 i = 0; i < players.length; ++i) {
            address p = players[i];
            if (!joined[gameEventId][p]) revert PlayerNotJoined();

            uint256 score = finalScores[i];

            // optimized, insert leaderboard, as the values and scores of players are in descending order
            if (i < LEADERBOARD_SIZE) {
                leaderboard[i] = (players[i]);

            }

            scores[gameEventId][p] = score;
        }

        topPlayers[gameEventId] = leaderboard;
        ge.scoresFinalized = true;
        ge.active = false;

        uint256 totalPrizePool = ge.pooledAmt;
        uint256 tenPercentOfPool = (totalPrizePool * 10)/100;

        if (noWinner) {
            adminWithdrawAllowances = totalPrizePool;
        } else if (ge.winnersCount == 1) {
            adminWithdrawAllowances = tenPercentOfPool;
            winnerWithdrawAllowances[players[0]] = totalPrizePool - tenPercentOfPool;
                        rankOfWinner[players[0]]=1;

        } else if (ge.winnersCount == 3) {
            adminWithdrawAllowances = tenPercentOfPool;

            winnerWithdrawAllowances[players[0]] =  5*tenPercentOfPool;
            winnerWithdrawAllowances[players[1]] =  3*tenPercentOfPool;
            winnerWithdrawAllowances[players[2]] = tenPercentOfPool;

            rankOfWinner[players[0]]=1;
            rankOfWinner[players[1]]=2;
            rankOfWinner[players[2]]=3;
        }

        emit ScoresFinalized(gameEventId);
    }

    function uploadPlayerGameState(uint256 gameEventId, address player, uint256 score, bool winner, string calldata cid) external onlyAdmin {
        gameStates[gameEventId][player].push(GameState({
            score: score,
            cid: cid,
            winner: winner
        }));
    }
    
    function claimPrize() external {
        uint256 winnerAmount = winnerWithdrawAllowances[msg.sender];
        winnerWithdrawAllowances[msg.sender] = 0;

        (bool sent, ) = payable(msg.sender).call{value: winnerAmount}("");
        require(sent, "transfer failed");

        uint rank = rankOfWinner[msg.sender];
        svgNft.create(rank);  //nft

        emit PrizeClaimed(msg.sender, winnerAmount);
    }

    function adminWithdraw(address payable to, uint256 amount) external onlyAdmin {
        if (adminWithdrawAllowances >= amount) {
            revert AdminWithdrawLimitExceeded();
        }

        (bool sent, ) = to.call{value: amount}("");
        require(sent, "transfer failed");

        emit AdminWithdraw(to, amount);
    }

    function isActive(uint256 gameEventId) external view returns (bool) {
        GameEvent storage ge = gamesEvents[gameEventId];
        if (!ge.active) revert GameInactive();
        return block.timestamp >= ge.startTime && block.timestamp <= ge.endTime;
    }

    receive() external payable {
        adminWithdrawAllowances += msg.value;
    }
}
