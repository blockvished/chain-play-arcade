const AI_Player = (board , last_move , current_move) => {
    const HUMAN = 'X';
    const AI = 'O';
    const EMPTY = '';

    const moveHistory = Array.isArray(current_move) ? current_move : [];

    //returns the empty cells in the board after the last move.
    function getEmptyCells(gameBoard) {
        const emptyCells = [];
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (gameBoard[row][col] === EMPTY) {
                    emptyCells.push({ row, col });
                }
            }
        }
        return emptyCells;
    }

    //evaluates the line and returns the score and the type of the line.
    function evaluateLine(line) {
        const aiCount = line.filter(cell => cell === AI).length;
        const humanCount = line.filter(cell => cell === HUMAN).length;
        const emptyCount = line.filter(cell => cell === EMPTY).length;
        if (aiCount > 0 && humanCount > 0) return { score: 0, type: 'mixed' };
        if (aiCount === 3 && emptyCount === 1) return { score: 1000, type: 'ai_win' };
        if (humanCount === 3 && emptyCount === 1) return { score: 900, type: 'block_human' };
        if (aiCount === 2 && emptyCount === 2) return { score: 50, type: 'ai_build' };
        if (aiCount === 1 && emptyCount === 3) return { score: 10, type: 'ai_start' };
        if (humanCount === 2 && emptyCount === 2) return { score: 30, type: 'human_threat' };
        if (humanCount === 1 && emptyCount === 3) return { score: 5, type: 'human_start' };
        return { score: 1, type: 'neutral' };
    }

    //returns all the lines in the board.
    function getAllLines(gameBoard) {
        const lines = [];
        for (let row = 0; row < 4; row++) {
            lines.push({
                cells: gameBoard[row].slice(),
                positions: Array.from({ length: 4 }, (_, col) => ({ row, col }))
            });
        }
        for (let col = 0; col < 4; col++) {
            lines.push({
                cells: Array.from({ length: 4 }, (_, row) => gameBoard[row][col]),
                positions: Array.from({ length: 4 }, (_, row) => ({ row, col }))
            });
        }
        lines.push({
            cells: Array.from({ length: 4 }, (_, i) => gameBoard[i][i]),
            positions: Array.from({ length: 4 }, (_, i) => ({ row: i, col: i }))
        });
        lines.push({
            cells: Array.from({ length: 4 }, (_, i) => gameBoard[i][3 - i]),
            positions: Array.from({ length: 4 }, (_, i) => ({ row: i, col: 3 - i }))
        });

        return lines;
    }

    //returns the disappearing moves in the history.
    function getDisappearingMoves(history) {
        const disappearingMoves = [];
        const aiMoves = history.filter(move => move.player === AI);

        //if the ai has made 4 moves, then the 4th move disappears from the board.
        if (aiMoves.length >= 4) {
            disappearingMoves.push(aiMoves[aiMoves.length - 4]);
        }
        //if the human has made 4 moves, then the 4th move disappears from the board.
        const humanMoves = history.filter(move => move.player === HUMAN);

        if (humanMoves.length >= 4) {
            disappearingMoves.push(humanMoves[humanMoves.length - 4]);
        }
        return disappearingMoves;
    }

    //evaluates the position and returns the score.
    function evaluatePosition(gameBoard, history, row, col) {
        let totalScore = 0;
        const move = { row, col };
        const lines = getAllLines(move);
        for (const line of lines) {
            const positionInLine = line.positions.findIndex(pos => pos.row === row && pos.col === col);
            if (positionInLine !== -1) {
                const evaluation = evaluateLine(line.cells);
                totalScore += evaluation.score;
                if (evaluation.type === 'ai_win') {
                    return 10000;
                }
                if (evaluation.type === 'block_human') {
                    totalScore += 5000;
                }
            }
        }
        const disappearingMoves = getDisappearingMoves(history, history.length + 1);
        const willDisappear = disappearingMoves.some(move => 
            move && move.row === row && move.col === col
        );
        //if the move will disappear, then the score is reduced.
        if (willDisappear) {
            totalScore -= 100;
        }
        const centerDistance = Math.abs(row - 1.5) + Math.abs(col - 1.5);
        totalScore += (3 - centerDistance) * 2;
        //if the move is in the center, then the score is increased.
        if ((row === 0 || row === 3) && (col === 0 || col === 3)) {
            totalScore += 5;
        }

        return totalScore;
    }

    //returns the best move for the ai.0
    const emptyCells = getEmptyCells(board);

    console.log(moveHistory.length);
    if (emptyCells.length === 0) {
        return null;
    }
    
    //here we can keep the random function to select the position randomly
    //used when ai plays first
    if (moveHistory.length === 0) {
        return { row: 1, col: 1 };
    }
    
    //if the move is in the center, then the score is increased.
    //useless functions....
    if (moveHistory.length === 1 && board[1][1] !== EMPTY) {
        return { row: 0, col: 0 };
    }
        
    let bestMove = null;
    let bestScore = -Infinity;
    for (const cell of emptyCells) {
        const score = evaluatePosition(board, moveHistory, cell.row, cell.col);
        if (score > bestScore) {
            bestScore = score;
            bestMove = cell;
        } else if (score === bestScore && Math.random() < 0.3) {
            bestMove = cell;
        }
    }

    return bestMove;
}


module.exports = { AI_Player};
