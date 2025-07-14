const { randomEvent } = require("./events");
const players = {};

function startGame(playerName, playerAge, playerGender) {
  const id = Date.now(); // Unique ID for the game instance
  const initialState = {
    id,
    player: { name: playerName, age: playerAge, gender: playerGender },
    money: 500,
    happiness: 60,
    health: 60,
    tiredness: 40,
    week: 1,
    gameOver: false,
    lastAction: "Game started!",
    lastEvent: "",
  };
  players[id] = initialState;
  return initialState;
}

function playTurn(gameId, action) {
  const state = players[gameId];
  if (!state || state.gameOver)
    return { error: "Game Over or invalid game state!" };

  // Update state based on action
  state.week++;
  state.lastAction = action;

  switch (action) {
    case "work":
      state.money += 500;
      state.tiredness += 20;
      state.happiness -= 5;
      state.lastAction = `Worked hard and earned $500!`;
      break;
    case "gym":
      const gymCost = Math.floor(Math.random() * (20 - 10 + 1)) + 10;
      state.money -= gymCost;
      state.tiredness -= 10;
      state.health += 10;
      state.lastAction = `Hit the gym! Cost: $${gymCost}.`;
      break;
    case "study":
      state.money -= 10;
      state.tiredness += 10;
      state.happiness -= 5;
      state.lastAction = `Studied hard! Cost: $10.`;
      break;
    case "home":
      const gasCost = Math.floor(Math.random() * (6 - 4 + 1)) + 4;
      state.money -= gasCost;
      state.lastAction = `Returned home! Gas cost: $${gasCost}.`;
      break;
    case "cn-tower":
      state.money -= 30;
      state.happiness += 20;
      state.lastAction = `Enjoyed the CN Tower! Cost: $30.`;
      break;
    case "pub":
      const pubCost =
        state.week % 7 === 5 || state.week % 7 === 6 // Friday/Saturday
          ? Math.floor(Math.random() * (70 - 40 + 1)) + 40
          : Math.floor(Math.random() * (25 - 15 + 1)) + 15;
      state.money -= pubCost;
      state.happiness += 10;
      state.lastAction = `Enjoyed the pub! Cost: $${pubCost}.`;
      break;
    default:
      state.lastAction = "Invalid action!";
  }

  // Random event
  const event = randomEvent();
  if (event) {
    state[event.affected] += event.amount;
    state.lastEvent = event.text;
  } else {
    state.lastEvent = "";
  }

  // Game over conditions
  if (state.happiness <= 0 || state.health <= 0 || state.money <= 0) {
    state.gameOver = true;
    state.lastAction = `Game Over! ${
      state.happiness <= 0
        ? "Too unhappy!"
        : state.health <= 0
        ? "Too unhealthy!"
        : "Out of money!"
    }`;
  }

  return state;
}

module.exports = { startGame, playTurn };
