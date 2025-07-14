import React from "react";
const buildings = [
  { id: "home", label: "Home", img: "/buildings/home.png" },
  { id: "work", label: "Work (MNC)", img: "/buildings/work.png" },
  { id: "gym", label: "Planet Fitness", img: "/buildings/gym.png" },
  { id: "pub", label: "Downtown Pub", img: "/buildings/pub.png" },
  { id: "cn-tower", label: "CN Tower", img: "/buildings/cn-tower.png" },
];
export default function BuildingMap({ current, onSelect, dayCount, phase }) {
  // Only show relevant buildings based on phase
  let visible = ["home"];
  if (phase === "choose-start")
    visible = ["home", "work", "gym", "pub", "cn-tower"];
  else if (phase === "choose-gym-study") visible = ["gym", "study"];
  else if (phase === "choose-activity") visible = ["study", "cn-tower", "pub"];
  else if (phase === "evening-choice") visible = ["home", "cn-tower", "pub"];
  return (
    <div className="building-map">
      {buildings
        .filter(
          (b) =>
            visible.includes(b.id) || visible.includes(b.label.toLowerCase())
        )
        .map((b) => (
          <button
            key={b.id}
            className="building-btn"
            onClick={() => onSelect && onSelect(b.id)}
            disabled={!onSelect}
          >
            <img src={b.img} alt={b.label} style={{ width: 80, height: 80 }} />
            <span>{b.label}</span>
          </button>
        ))}
      {/* Show study as a book icon */}
      {visible.includes("study") && (
        <button className="building-btn" onClick={() => onSelect("study")}>
          <span role="img" aria-label="study" style={{ fontSize: 48 }}>
            📚
          </span>
          <span>Study</span>
        </button>
      )}
    </div>
  );
}
