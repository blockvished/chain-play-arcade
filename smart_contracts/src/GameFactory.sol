// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract GameRegistry {
    struct GameDefinition {
        uint256 id;
        string name;
        string image;      
        string description;
    }

    uint256 public gameIdCount = 1;

    constructor() {}

    mapping(uint256 gameId => GameDefinition) private gameDefinitions;
    GameDefinition[] private allGames;


    function createGameDefinition(
        string calldata name,
        string calldata image,
        string calldata description
    ) public {
        uint256 gameId = gameIdCount;

        GameDefinition memory newGame = GameDefinition({
            id: gameId,
            name: name,
            image: image,
            description: description
        });

        gameDefinitions[gameId] = newGame;
        allGames.push(newGame);

        gameIdCount++;
    }

    function getGameDefinition(uint256 gameId) public view returns (GameDefinition memory) {
        return gameDefinitions[gameId];
    }

    function getAllGames() public view returns (GameDefinition[] memory) {
        return allGames;
    }

}