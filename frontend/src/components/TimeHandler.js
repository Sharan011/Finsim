import React from "react";

export default function StatusBar({ state }) {
  return (
    <div className="status-bar">
      <span className="stat">💸 ${state.money}</span>
      <span className="stat">😊 {state.happiness}</span>
      <span className="stat">❤️ {state.health}</span>
      <span className="stat">🧠 {state.smarts}</span>
      <span className="stat">😴 {state.tiredness}</span>
      <span className="stat">📅 Week {state.week}</span>
    </div>
  );
}
