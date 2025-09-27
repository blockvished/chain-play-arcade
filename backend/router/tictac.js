//demo routes

const express = require("express");
const router = express.Router();
const { gamePlay } = require("../controller/tictac_controller");

router.post('/play', gamePlay);

module.exports = router;