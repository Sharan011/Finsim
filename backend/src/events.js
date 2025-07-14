function randomEvent() {
  const events = [
    { text: "You found $20 on the street!", amount: 20, affected: "money" },
    {
      text: "You lost $15 due to a parking fine!",
      amount: -15,
      affected: "money",
    },
    {
      text: "You feel refreshed and happy!",
      amount: 10,
      affected: "happiness",
    },
    {
      text: "You caught a cold and feel unwell.",
      amount: -10,
      affected: "health",
    },
  ];
  return events[Math.floor(Math.random() * events.length)];
}

module.exports = { randomEvent };
