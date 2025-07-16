import React, { useState } from "react";

// Play click sound utility
const playClick = () => {
  const audio = new window.Audio("assets/click.mp3");
  audio.volume = 0.5;
  audio.play();
};

const CHARACTERS = [
  {
    id: "male",
    label: "Male",
    img: "/assets/char-male.png",
  },
  {
    id: "female",
    label: "Female",
    img: "/assets/char-female.png",
  },
];

const PlayerIntro = ({ onIntroComplete }) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState(""); // not pre-selected!
  const [error, setError] = useState("");

  const handleStart = (e) => {
    playClick();
    e.preventDefault();
    if (!name) {
      setError("Please enter your name.");
      return;
    }
    if (!age || age < 18) {
      setError("Age must be at least 18.");
      return;
    }
    if (!gender) {
      setError("Please choose a character.");
      return;
    }
    setError("");
    const player = { name, age, gender };
    onIntroComplete(player);
  };

  const handleCharacterSelect = (charId) => {
    playClick();
    setGender(charId);
    setError("");
  };

  // Button enabled only if all fields are valid
  const canStart = name.trim() !== "" && age && +age >= 18 && gender !== "";

  return (
    <div className="player-intro-bg">
      <form
        className="player-intro-glass"
        onSubmit={handleStart}
        autoComplete="off"
      >
        <h1 className="pixel-title">Welcome to Pixel Life!</h1>
        <div className="player-intro-bar">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            tabIndex={1}
          />
          <input
            type="number"
            placeholder="Your Age"
            min={18}
            value={age}
            onChange={(e) => {
              let v = e.target.value;
              if (v === "" || (+v >= 18 && /^\d+$/.test(v))) {
                setAge(v);
                setError("");
              } else if (+v < 18) {
                setAge(v);
                setError("Age must be at least 18.");
              }
            }}
            tabIndex={2}
          />
        </div>
        <div className="choose-character-box">
          <div className="choose-character-title">Choose Character</div>
          <div className="choose-character-row">
            {CHARACTERS.map((char) => (
              <div
                key={char.id}
                className={
                  "character-choice" + (gender === char.id ? " selected" : "")
                }
                onClick={() => handleCharacterSelect(char.id)}
                tabIndex={3}
                role="button"
                aria-label={char.label}
              >
                <div className="character-img-wrap">
                  <img src={char.img} alt={char.label} />
                </div>
                <div className="character-label">{char.label}</div>
              </div>
            ))}
          </div>
        </div>
        {error && <div className="intro-error">{error}</div>}
        <button
          type="submit"
          className="start-btn"
          tabIndex={4}
          disabled={!canStart}
          onClick={canStart ? playClick : undefined}
        >
          Start Game
        </button>
      </form>
    </div>
  );
};

export default PlayerIntro;
