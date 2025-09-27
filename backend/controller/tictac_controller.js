const { AI_Player } = require("../utils/tictac_utils");

const games = new Map();

function createGame() {
    const gameId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const game = {
        id: gameId,
        board: [
            ["", "", "", ""],
            ["", "", "", ""],
            ["", "", "", ""],
            ["", "", "", ""]
        ],
        moveHistory: [],
        status: "playing", // "playing", "won", "draw", "gameOver"
        winner: null,
        currentPlayer: "X", // Human starts first
        gameStartTime: new Date().toISOString(),
        gameEndTime: null,
        moveCount: 0
    };
    games.set(gameId, game);
    return game;
}

// Check for winner
function checkWinner(board) {
    const lines = [];
    
    // Rows
    for (let row = 0; row < 4; row++) {
        lines.push(board[row]);
    }
    
    // Columns
    for (let col = 0; col < 4; col++) {
        lines.push([board[0][col], board[1][col], board[2][col], board[3][col]]);
    }
    
    // Diagonals
    lines.push([board[0][0], board[1][1], board[2][2], board[3][3]]);
    lines.push([board[0][3], board[1][2], board[2][1], board[3][0]]);
    
    for (const line of lines) {
        if (line.every(cell => cell === "X")) return "X";
        if (line.every(cell => cell === "O")) return "O";
    }
    
    return null;
}

// Check if board is full
function isBoardFull(board) {
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === "") return false;
        }
    }
    return true;
}


// End game and set end timestamp
function endGame(game, winner = null) {
    game.status = winner ? "won" : "draw";
    game.winner = winner;
    game.gameEndTime = new Date().toISOString();
    return game;
}

const gamePlay = (req, res) => {
    try{
        const gameId = req.params.gameId;
        const { row, col } = req.body;

        let game;
        
        // Get existing game or create new one
        if (gameId && games.has(gameId)) {
            game = games.get(gameId);
        } else {
            game = createGame();
        }
        
        // Check if game is over
        if (game.status !== "playing") {
            return res.status(400).json({
                success: false,
                error: "Game is already over",
                game: {
                    id: game.id,
                    board: game.board,
                    status: game.status,
                    winner: game.winner
                }
            });
        }

        // Make human move
        game.board[row][col] = "X";
        game.moveHistory.push({ row, col, player: "X" });
        game.moveCount++;
        
        // Apply memory decay for human
        applyMemoryDecay(game.board, game.moveHistory, "X");
        
        // Check for human win
        const winner = checkWinner(game.board);
        if (winner === "X") {
            endGame(game, "X");
            return res.json({
                success: true,
                game: {
                    id: game.id,
                    board: game.board,
                    status: game.status,
                    winner: game.winner,
                    gameStartTime: game.gameStartTime,
                    gameEndTime: game.gameEndTime,
                    moveCount: game.moveCount,
                    message: "You won!"
                }
            });
        }

        // Get AI move
        const aiMove = AI_Player(game.board, { row, col }, game.moveHistory);

        if (!aiMove) {
            endGame(game, null);
            return res.json({
                success: true,
                game: {
                    id: game.id,
                    board: game.board,
                    status: game.status,
                    winner: null,
                    gameStartTime: game.gameStartTime,
                    gameEndTime: game.gameEndTime,
                    moveCount: game.moveCount,
                    message: "No valid moves available"
                }
            });
        }

        // Make AI move
        game.board[aiMove.row][aiMove.col] = "O";
        game.moveHistory.push({ row: aiMove.row, col: aiMove.col, player: "O" });
        game.moveCount++;


        // Apply memory decay for AI
        applyMemoryDecay(game.board, game.moveHistory, "O");

                // Check for AI win
        const aiWinner = checkWinner(game.board);
        if (aiWinner === "O") {
            endGame(game, "O");
            return res.json({
                success: true,
                game: {
                    id: game.id,
                    board: game.board,
                    status: game.status,
                    winner: game.winner,
                    gameStartTime: game.gameStartTime,
                    gameEndTime: game.gameEndTime,
                    moveCount: game.moveCount,
                    aiMove: { row: aiMove.row, col: aiMove.col },
                    message: "AI won!"
                }
            });
        }

        // Game continues
        return res.json({
            success: true,
            game: {
                id: game.id,
                board: game.board,
                status: game.status,
                winner: null,
                gameStartTime: game.gameStartTime,
                moveCount: game.moveCount,
                aiMove: { row: aiMove.row, col: aiMove.col },
                message: "Game continues"
            }
        });

    }catch (error) {
        console.error("Error in gamePlay:", error);
        return res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
}

module.exports = { gamePlay };
