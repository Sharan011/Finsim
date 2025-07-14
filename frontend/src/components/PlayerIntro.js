import React, { useState } from "react";
import SpeechBubble from "./SpeechBubble";

const PlayerIntro = ({ onIntroComplete }) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");

  const handleStart = () => {
    if (name && age) {
      const player = { name, age, gender };
      onIntroComplete(player);
    }
  };

  return (
    <div className="player-intro">
      <h2>Welcome to Pixel Life!</h2>
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Your Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <select value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <button onClick={handleStart}>Start Game</button>
    </div>
  );
};

export default PlayerIntro;
