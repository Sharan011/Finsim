import React from "react";

const menuItems = [
  {
    id: "home",
    label: "Home",
    img: "/buildings/home.png",
    style: { left: "23%", top: "78%" },
  },
  {
    id: "work",
    label: "Work (MNC)",
    img: "/buildings/work.png",
    style: { left: "60%", top: "89%" },
  },
  {
    id: "gym",
    label: "Planet Fitness",
    img: "/buildings/gym.png",
    style: { left: "74%", top: "62%" },
  },
  {
    id: "pub",
    label: "Downtown Pub",
    img: "/buildings/pub.png",
    style: { left: "69%", top: "35%" },
  },
  {
    id: "cn-tower",
    label: "CN Tower",
    img: "/buildings/cn-tower.png",
    style: { left: "60.5%", top: "43%" },
  },
];

const playClick = () => {
  const audio = new window.Audio("/assets/click.mp3");
  audio.volume = 0.5;
  audio.play().catch(() => {});
};

export default function BuildingMenuScene({ player }) {
  return (
    <div className="menu-bg-full">
      <img
        src="/buildings/menu.jpg"
        alt="Toronto aerial"
        className="menu-bg-img"
      />
      {/* Player intro bubble */}
      <div className="player-intro-bubble">
        <img
          src={player?.characterImg || "/assets/char-male.png"}
          alt={player?.character || "Player"}
          className="player-menu-avatar"
        />
        <div className="bubble-content">
          <div className="player-name">{player?.name || "Player"}</div>
          <div className="player-age">
            {player?.age ? `Age: ${player.age}` : ""}
          </div>
          <div className="player-character">
            {player?.character ? `Character: ${player.character}` : ""}
          </div>
        </div>
        <div className="bubble-pointer"></div>
      </div>
      {/* Speech bubble for menu */}
      <div className="choose-place-bubble">
        Alright, now it’s time to choose the place you want to head to
        <div className="bubble-pointer2"></div>
      </div>

      {/* Menu items */}
      {menuItems.map((item) => (
        <button
          key={item.id}
          className="menu-item-btn"
          style={item.style}
          onClick={playClick}
        >
          <img src={item.img} alt={item.label} />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
