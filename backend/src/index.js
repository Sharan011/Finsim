const express = require("express");
const cors = require("cors");
const { startGame, playTurn } = require("./game");

const app = express();
app.use(cors());
app.use(express.json());

// Start a new game
app.post("/api/game/start", (req, res) => {
  const { playerName, playerAge, playerGender } = req.body;
  const gameState = startGame(playerName, playerAge, playerGender);
  res.json(gameState);
});

// Perform a turn action
app.post("/api/game/turn", (req, res) => {
  const { gameId, action } = req.body;
  const updatedState = playTurn(gameId, action);
  res.json(updatedState);
});

app.listen(5000, () => console.log("Backend server running on port 5000"));
