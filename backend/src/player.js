let scores = [];

function getLeaderboard() {
  // Top 10 scores, descending
  return scores.sort((a, b) => b.score - a.score).slice(0, 10);
}

function postLeaderboard({ name, score }) {
  scores.push({ name, score });
}

module.exports = { getLeaderboard, postLeaderboard };
