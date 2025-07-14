export async function startGame(playerName) {
  const res = await fetch("http://localhost:5000/api/game/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playerName }),
  });
  return res.json();
}
export async function playTurn(gameId, action) {
  const res = await fetch("http://localhost:5000/api/game/turn", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gameId, action }),
  });
  return res.json();
}
