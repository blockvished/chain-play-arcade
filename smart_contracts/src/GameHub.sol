// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { GameRegistry } from "./GameFactory.sol";

contract GameHub is GameRegistry {

    uint256 public gameEventCount = 1;

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


    mapping(uint256 => mapping(address => bool)) public joined;
    mapping(uint256 => GameEvent) public gamesEvents;


    function createGameEvent(string calldata eventName, uint256 durationMinutes, uint256 minStakeAmt, uint256 winnersCount, bool activate) external {
        require(durationMinutes > 10, "duration must be > 10 minutes");

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
        ge.referencedGameId = gameEventId;

        ge.active = activate;
        ge.durationMinutes = durationMinutes;
        ge.minStakeAmt = minStakeAmt;
        ge.winnersCount = winnersCount;
        ge.scoresFinalized = false;

        gameEventCount += 1;
    }


    function joinGame(uint256 gameEventId) external payable {
        GameEvent storage ge = gamesEvents[gameEventId];

        ge.pooledAmt += msg.value;

        joined[gameEventId][msg.sender] = true;
        ge.playersCount += 1;
    }

    function activateGame(uint256 gameEventId) external {
        GameEvent storage ge = gamesEvents[gameEventId];
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + (ge.durationMinutes * 1 minutes);
        ge.startTime = startTime;
        ge.endTime = endTime;
        ge.active = true;
    }

    receive() external payable {}
}