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
        moveCount: 0,
        // Per-turn cumulative log for post-match analysis
        // Each entry: { human_choice: {row, col}, ai_move: {row, col} | null, deleting_cell: [{row, col, player}] }
        turnLog: []
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

// Validate move
function isValidMove(board, row, col) {
    return row >= 0 && row < 4 && col >= 0 && col < 4 && board[row][col] === "";
}

// End game and set end timestamp
function endGame(game, winner = null) {
    game.status = winner ? "won" : "draw";
    game.winner = winner;
    game.gameEndTime = new Date().toISOString();
    return game;
}

// Apply memory decay (oldest of 5th move disappears)
function applyMemoryDecay(board, moveHistory, player) {
    const playerMoves = moveHistory.filter(move => move.player === player);
    if (playerMoves.length > 4) {
        const disappearingMove = playerMoves[playerMoves.length - 5];
        board[disappearingMove.row][disappearingMove.col] = "";
        return { row: disappearingMove.row, col: disappearingMove.col, player };
    }
    return null;
}

// Record a single turn composed of human move, optional AI move, and any deleted cells
function logTurn(game, humanChoice, aiMove, humanDeletedCell, aiDeletedCell) {
    const deletedCells = [];
    if (humanDeletedCell) deletedCells.push({ row: humanDeletedCell.row, col: humanDeletedCell.col, player: humanDeletedCell.player });
    if (aiDeletedCell) deletedCells.push({ row: aiDeletedCell.row, col: aiDeletedCell.col, player: aiDeletedCell.player });

    game.turnLog.push({
        human_choice: humanChoice ? { row: humanChoice.row, col: humanChoice.col } : null,
        ai_move: aiMove ? { row: aiMove.row, col: aiMove.col } : null,
        deleting_cell: deletedCells.length > 0 ? deletedCells : null
    });
}

function generatePoints(status, moves, time) {
    const basePoints = 100;
    let totalPoints = 0;
    //update the loss points based on event timer 
    
    // Calculate time in seconds
    const timeInSeconds = time / 1000;
    
    // Base points based on outcome
    if (status === "won") {
        totalPoints = basePoints;
    } else if (status === "lost") {
        totalPoints = -basePoints * 0.5; // Lose 50 points on loss
    } else {
        totalPoints = 0; // No points for draw
    }
    
    // Speed bonus/penalty (faster = more points)
    const averageTimePerMove = timeInSeconds / moves;
    if (averageTimePerMove < 5) {
        totalPoints += 20; // Fast player bonus
    } else if (averageTimePerMove > 15) {
        totalPoints -= 10; // Slow player penalty
    }
    
    // Efficiency bonus (fewer moves = more points)
    if (status === "won") {
        if (moves <= 15) {
            totalPoints += 30; // Perfect game
        } else if (moves <= 20) {
            totalPoints += 15; // Good game
        }
    }
    
    // Time bonus for quick victories
    if (status === "won" && timeInSeconds < 60) {
        totalPoints += 25; // Quick victory bonus
    }
    
    return {
        totalPoints: Math.max(totalPoints, 0), // Never go below 0
        breakdown: {
            base: status === "won" ? basePoints : (status === "lost" ? -50 : 0),
            speed: averageTimePerMove < 5 ? 20 : (averageTimePerMove > 15 ? -10 : 0),
            efficiency: status === "won" ? (moves <= 8 ? 30 : (moves <= 12 ? 15 : 0)) : 0,
            time: status === "won" && timeInSeconds < 60 ? 25 : 0
        }
    };
}

const gamePlay = (req, res) => {
    try{
        const gameId = req.query.gameId;
        const { row, col } = req.body;

        // Validate input
        if (typeof row !== 'number' || typeof col !== 'number' || 
            row < 0 || row > 3 || col < 0 || col > 3) {
            return res.status(400).json({
                success: false,
                error: "Invalid coordinates. Use numbers 0-3 for row and col."
            });
        }

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

        // Validate move
        if (!isValidMove(game.board, row, col)) {
            return res.status(400).json({
                success: false,
                error: "Invalid move. Cell is not empty or out of bounds."
            });
        }
        

        // Make human move
        const humanChoice = { row, col };
        game.board[row][col] = "X";
        game.moveHistory.push({ row, col, player: "X" });
        game.moveCount++;
        
        // Apply memory decay for human and capture deleted cell (if any)
        const humanDeletedCell = applyMemoryDecay(game.board, game.moveHistory, "X");
        
        // Check for human win
        const winner = checkWinner(game.board);
        if (winner === "X") {
            endGame(game, "X");
            
            // Log this (final) turn without an AI move
            logTurn(game, humanChoice, null, humanDeletedCell, null);
            
            // Calculate game duration and points
            const gameDuration = new Date() - new Date(game.gameStartTime);
            const points = generatePoints("won", game.moveCount, gameDuration);
            
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
                    message: "You won!",
                    points: points,
                    turnLog: game.turnLog
                }
            });
        }

        // Get AI move
        const aiMove = AI_Player(game.board, { row, col }, game.moveHistory);

        if (!aiMove) {
            endGame(game, null);
            
            // Calculate game duration and points for draw
            const gameDuration = new Date() - new Date(game.gameStartTime);
            const points = generatePoints("draw", game.moveCount, gameDuration);
            
            // Log this turn (no AI move)
            logTurn(game, humanChoice, null, humanDeletedCell, null);
            
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
                    message: "No valid moves available",
                    points: points,
                    turnLog: game.turnLog
                }
            });
        }

        // Make AI move
        game.board[aiMove.row][aiMove.col] = "O";
        game.moveHistory.push({ row: aiMove.row, col: aiMove.col, player: "O" });
        game.moveCount++;


        // Apply memory decay for AI and capture deleted cell (if any)
        const aiDeletedCell = applyMemoryDecay(game.board, game.moveHistory, "O");

        // Log the full turn with both human and AI actions
        logTurn(game, humanChoice, aiMove, humanDeletedCell, aiDeletedCell);

                // Check for AI win
        const aiWinner = checkWinner(game.board);
        if (aiWinner === "O") {
            endGame(game, "O");
            
            // Calculate game duration and points for loss
            const gameDuration = new Date() - new Date(game.gameStartTime);
            const points = generatePoints("lost", game.moveCount, gameDuration);
            
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
                    message: "AI won!",
                    points: points,
                    turnLog: game.turnLog
                }
            });
        }

        // Build deleted cells for this turn so frontend can animate properly
        const deletedCellsThisTurn = [];
        if (humanDeletedCell) deletedCellsThisTurn.push({ row: humanDeletedCell.row, col: humanDeletedCell.col, player: humanDeletedCell.player });
        if (aiDeletedCell) deletedCellsThisTurn.push({ row: aiDeletedCell.row, col: aiDeletedCell.col, player: aiDeletedCell.player });

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
                message: "Game continues",
                deletedCellsThisTurn
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
