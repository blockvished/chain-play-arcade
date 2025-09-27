const { AI_Player } = require("../utils/tictac_utils");

const gamePlay = (req, res) => {
    const { board, last_move, current_move } = req.body;
    const move = AI_Player(board, last_move, current_move);
    res.json({ move });
}

module.exports = { gamePlay };
