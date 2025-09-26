// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/GameFactory.sol";

contract GameRegistryTest is Test {
    GameRegistry registry;

    function setUp() public {
        registry = new GameRegistry();
    }

    function testInitialState() public {
        assertEq(registry.gameIdCount(), 1);
        GameRegistry.GameDefinition[] memory games = registry.getAllGames();
        assertEq(games.length, 0);
    }

    function testCreateGameDefinition() public {
        registry.createGameDefinition("Chess", "chess.png", "A strategy board game");

        assertEq(registry.gameIdCount(), 2);

        GameRegistry.GameDefinition memory game = registry.getGameDefinition(1);
        assertEq(game.id, 1);
        assertEq(game.name, "Chess");
        assertEq(game.image, "chess.png");
        assertEq(game.description, "A strategy board game");

        GameRegistry.GameDefinition[] memory games = registry.getAllGames();
        assertEq(games.length, 1);
        assertEq(games[0].id, 1);
        assertEq(games[0].name, "Chess");
    }

    function testMultipleGames() public {
        registry.createGameDefinition("Chess", "chess.png", "A strategy board game");
        registry.createGameDefinition("Sudoku", "sudoku.png", "Number placement puzzle");
        registry.createGameDefinition("Poker", "poker.png", "Card game");

        assertEq(registry.gameIdCount(), 4);

        GameRegistry.GameDefinition[] memory games = registry.getAllGames();
        assertEq(games.length, 3);

        assertEq(games[0].name, "Chess");
        assertEq(games[1].name, "Sudoku");
        assertEq(games[2].name, "Poker");

        GameRegistry.GameDefinition memory sudoku = registry.getGameDefinition(2);
        assertEq(sudoku.name, "Sudoku");
        assertEq(sudoku.image, "sudoku.png");
    }

    function testGetNonExistentGame() public {
        GameRegistry.GameDefinition memory game = registry.getGameDefinition(99);
        assertEq(game.id, 0);
        assertEq(bytes(game.name).length, 0);
    }
}
