// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract GameRegistry is Ownable {
    struct GameDefinition {
        uint256 id;
        string name;
        string image;       // ipfs uri or img link for now
        string description;
    }

    uint256 public gameIdCount = 1;

    mapping(uint256 gameId => GameDefinition) private gameDefinitions;
    GameDefinition[] private allGames;

    event GameDefinitionCreated(uint256 indexed gameId, string name, string image);
    event GameImageUpdated(uint256 indexed gameId, string newImage);

    constructor() Ownable(msg.sender) {}

    function createGameDefinition(
        string calldata name,
        string calldata image,
        string calldata description
    ) public onlyOwner {
        uint256 gameId = gameIdCount;

        GameDefinition memory newGame = GameDefinition({
            id: gameId,
            name: name,
            image: image,
            description: description
        });

        gameDefinitions[gameId] = newGame;
        allGames.push(newGame); // add new game to array

        emit GameDefinitionCreated(gameId, name, image);

        gameIdCount++;
    }

    function getGameDefinition(uint256 gameId) public view returns (GameDefinition memory) {
        return gameDefinitions[gameId];
    }

    function getAllGames() public view returns (GameDefinition[] memory) {
        return allGames;
    }

}