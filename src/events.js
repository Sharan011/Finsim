function getRandomEvent(player) {
  const events = [
    {
      msg: "You found $50 on the street!",
      effect: () => (player.balance += 50),
    },
    {
      msg: "Surprise car repair! -$100",
      effect: () => (player.balance -= 100),
    },
    { msg: "Bonus at work! +$200", effect: () => (player.balance += 200) },
    { msg: "Medical bill! -$150", effect: () => (player.balance -= 150) },
    { msg: "No events this month.", effect: () => {} },
  ];
  const event = events[Math.floor(Math.random() * events.length)];
  console.log("Event:", event.msg);
  event.effect();
}
module.exports = { getRandomEvent };
