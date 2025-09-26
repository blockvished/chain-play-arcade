// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { GameRegistry } from "./GameFactory.sol";

contract GameHub is GameRegistry {

    struct Event {
        uint256 startTime;
        uint256 endTime;
        uint256 referencedGameId;
        uint256 durationMinutes;
        uint256 minStakeAmt;
        uint256 pooledAmt;
    }

    uint256 public gameEventCount = 1;


    mapping(uint256 => mapping(address => bool)) public joined;
    mapping(uint256 => Event) public gamesEvents;


    function createGameEvent(uint256 id, uint256 startTime, uint256 durationMinutes, uint256 minStakeAmt) external {
        require(durationMinutes > 10, "duration must be > 10 minutes");

        Event storage ge = gamesEvents[id];

        ge.startTime = block.timestamp;
        ge.endTime = startTime + (durationMinutes * 1 minutes);

        ge.durationMinutes = durationMinutes;
        ge.minStakeAmt = minStakeAmt;
    }

    function joinGame(uint256 id) external payable {
        Event storage ge = gamesEvents[id];
        ge.pooledAmt += msg.value;

        joined[id][msg.sender] = true;
    }
}