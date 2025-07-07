const { Player } = require("./player");
const { getRandomEvent } = require("./events");
const readline = require("readline");

function startGame() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const player = new Player();

  console.log("Welcome to Personal Finance Simulator!");
  function gameLoop() {
    if (player.balance < 0) {
      console.log("Game Over! You went bankrupt.");
      rl.close();
      return;
    }
    console.log(
      `\nMonth: ${player.month}, Balance: $${player.balance}, Savings: $${player.savings}`
    );
    rl.question("Choose: [s]ave, [e]xpense, [q]uit: ", (answer) => {
      if (answer === "s") {
        player.save();
      } else if (answer === "e") {
        player.expense();
      } else if (answer === "q") {
        rl.close();
        return;
      }
      getRandomEvent(player);
      player.nextMonth();
      gameLoop();
    });
  }
  gameLoop();
}

module.exports = { startGame };
