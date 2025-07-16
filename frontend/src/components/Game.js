import React, { useState } from "react";
import "../App.css";

// --- DATA ---
const INIT_PURSE = 500;
const INIT_HAPPINESS = 50;
const WORK_PAY = 500;
const FADE_DURATION = 1500;
const BUBBLE_DELAY = 1200;
const BUBBLE_DURATION = 2500;

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const PLACES = [
  {
    id: "home",
    label: "Home",
    bg: "/buildings/home.jpg",
    img: "/buildings/home.png",
    style: { left: "10%", top: "75%" },
  },
  {
    id: "work",
    label: "Work (MNC)",
    bg: "/buildings/work.jpg",
    img: "/buildings/work.png",
    style: { left: "70%", top: "80%" },
  },
  {
    id: "gym",
    label: "Planet Fitness",
    bg: "/buildings/gym-bg.jpg",
    img: "/buildings/gym.png",
    style: { left: "83%", top: "55%" },
  },
  {
    id: "pub",
    label: "Downtown Pub",
    bg: "/buildings/pub.jpg",
    img: "/buildings/pub.png",
    style: { left: "66%", top: "22%" },
  },
  {
    id: "cn-tower",
    label: "CN Tower",
    bg: "/buildings/cn-tower.jpg",
    img: "/buildings/cn-tower.png",
    style: { left: "52%", top: "38%" },
  },
];

const MOTIVATIONAL_QUOTES = [
  "Success is no accident.",
  "Dream big. Work hard.",
  "Don’t watch the clock; do what it does. Keep going.",
  "Hard work pays off.",
  "Great things never come from comfort zones.",
  "Monday is a fresh start, let’s make it count!",
  "Let’s crush it at work today!",
];
const HOME_QUOTES = [
  "Home sweet home, the best place to be!",
  "There's no place like home.",
  "Rest well, tomorrow's a new day!",
  "Nighty night! Recharging for new adventures.",
];
const MORNING_QUOTES = [
  "Wakey wakey! Time to shine.",
  "Rise & shine, it's a new day! 🥞",
  "Breakfast time! Let's get ready for work.",
  "Good morning! Ready for a new week?",
];
const EXERCISE_DAYS = ["Leg Day", "Lat Day", "Chest Day", "Arms Day", "Cardio"];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function playSound(type) {
  let url = "";
  if (type === "click") url = "/sounds/click.mp3";
  if (type === "credit") url = "/sounds/credit.mp3";
  if (type === "debit") url = "/sounds/debit.mp3";
  if (url) {
    const audio = new window.Audio(url);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  }
}

// Time helpers
function getTimeParts(timeStr) {
  const [hour, min] = timeStr.split(":").map(Number);
  return { hour, min };
}
function pad(n) {
  return n < 10 ? "0" + n : "" + n;
}
function addMinutes(timeStr, mins) {
  let { hour, min } = getTimeParts(timeStr);
  min += mins;
  while (min >= 60) {
    min -= 60;
    hour++;
  }
  while (hour >= 24) {
    hour -= 24;
  }
  return pad(hour) + ":" + pad(min);
}
function nextWeekday(current) {
  const idx = WEEKDAYS.indexOf(current);
  return WEEKDAYS[(idx + 1) % 7];
}
function menuEnabled(item, hour, weekday) {
  const isWeekend = weekday === "Saturday" || weekday === "Sunday";
  if (isWeekend && weekday === "Sunday" && hour < 8 && item.id !== "home")
    return false;
  if (isWeekend && item.id === "work") return false;
  if (!isWeekend && (hour < 8 || hour >= 21) && item.id !== "home")
    return false;
  if (!isWeekend && hour >= 8 && hour < 18 && item.id !== "work") return false;
  if (!isWeekend && hour >= 18 && hour < 21 && item.id === "work") return false;
  return true;
}

export default function Game() {
  // --- Player Setup State ---
  const [playerSetup, setPlayerSetup] = useState({
    name: "",
    age: "",
    gender: "male",
  });
  const [playerReady, setPlayerReady] = useState(false);

  // --- Game State ---
  const [location, setLocation] = useState("menu");
  const [sceneFade, setSceneFade] = useState("scene-fade-in");
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [speech, setSpeech] = useState("Choose a place to go!");
  const [purse, setPurse] = useState(INIT_PURSE);
  const [purseAnim, setPurseAnim] = useState(null);
  const [player, setPlayer] = useState({
    name: "",
    age: "",
    gender: "male",
    happiness: INIT_HAPPINESS,
  });
  const [weekday, setWeekday] = useState("Wednesday");
  const [timeStr, setTimeStr] = useState("08:30");

  // Setup form submit
  function handlePlayerSetup(e) {
    e.preventDefault();
    setPlayer({
      name: playerSetup.name,
      age: playerSetup.age,
      gender: playerSetup.gender,
      happiness: INIT_HAPPINESS,
    });
    setPlayerReady(true);
    setSpeech(`Hi ${playerSetup.name}, choose a place to go!`);
  }

  function animatePurse(type) {
    setPurseAnim(type);
    setTimeout(() => setPurseAnim(null), 1000);
  }
  function creditMoney(val) {
    setPurse((p) => p + val);
    animatePurse("credit");
    playSound("credit");
  }
  function debitMoney(val) {
    setPurse((p) => p - val);
    animatePurse("debit");
    playSound("debit");
  }

  // Status bar
  const statusBar = (
    <div className="menu-status-bar">
      <span>
        <b>{weekday}</b>
      </span>
      <span>
        <b>{timeStr} (EST)</b>
      </span>
      <span className={`menu-purse${purseAnim ? " purse-" + purseAnim : ""}`}>
        <b>
          <span role="img" aria-label="money">
            💰
          </span>{" "}
          ${purse}
        </b>
      </span>
      <span className="menu-happiness">
        <b>😊 {player.happiness}%</b>
      </span>
    </div>
  );

  // -- Main Transition Logic --
  function handlePlace(id) {
    playSound("click");
    setSceneFade("scene-fade-out");
    setBubbleVisible(false);

    setTimeout(() => {
      setLocation(id);
      setSceneFade("scene-fade-in");

      let bubbleMsg = "";
      let updateFn = () => {};

      // Special logic for "home" - night and then morning transition
      if (id === "home") {
        // NIGHT: show night quote, set to 22:00
        setTimeout(() => {
          setBubbleVisible(true);
          setSpeech(getRandom(HOME_QUOTES));
          setTimeStr("22:00");
          // After night bubble, fade out, then show morning bubble
          setTimeout(() => {
            setBubbleVisible(false);
            setSceneFade("scene-fade-out");
            setTimeout(() => {
              setSceneFade("scene-fade-in");
              setBubbleVisible(true);
              setSpeech(getRandom(MORNING_QUOTES));
              setWeekday(nextWeekday(weekday));
              setTimeStr("07:00");
              // After morning bubble, back to menu
              setTimeout(() => {
                setBubbleVisible(false);
                setSceneFade("scene-fade-out");
                setTimeout(() => {
                  setLocation("menu");
                  setSceneFade("scene-fade-in");
                  setBubbleVisible(true);
                  setSpeech(`Hi ${player.name}, choose a place to go!`);
                }, FADE_DURATION);
              }, BUBBLE_DURATION);
            }, FADE_DURATION);
          }, BUBBLE_DURATION);
        }, BUBBLE_DELAY);
        return; // "home" handled, return early
      }

      // All other places
      if (id === "work") {
        bubbleMsg =
          getRandom(MOTIVATIONAL_QUOTES) + " Today's wages: $500 credited!";
        updateFn = () => {
          creditMoney(WORK_PAY);
          setTimeStr("18:00");
        };
      } else if (id === "gym") {
        const gasCost = getRandom([4, 5, 6]);
        const gymFee = getRandom([10, 12, 15, 18, 20]);
        bubbleMsg = `${getRandom(MOTIVATIONAL_QUOTES)} (${getRandom(
          EXERCISE_DAYS
        )})\nGas: $${gasCost}, Gym: $${gymFee}`;
        updateFn = () => {
          debitMoney(gasCost);
          debitMoney(gymFee);
          setTimeStr(addMinutes(timeStr, 90));
        };
      } else if (id === "pub") {
        const pubCost = getRandom([20, 25, 30, 35, 40]);
        bubbleMsg = "Enjoying the night at the pub with friends.";
        updateFn = () => {
          debitMoney(pubCost);
          setTimeStr(addMinutes(timeStr, 120));
        };
      } else if (id === "cn-tower") {
        bubbleMsg = "Exploring CN Tower! The city looks amazing from up here.";
        updateFn = () => {
          debitMoney(30);
          setTimeStr(addMinutes(timeStr, 60));
        };
      }

      setTimeout(() => {
        setBubbleVisible(true);
        setSpeech(bubbleMsg);

        setTimeout(() => {
          updateFn();

          setTimeout(() => {
            setBubbleVisible(false);
            setSceneFade("scene-fade-out");

            setTimeout(() => {
              setLocation("menu");
              setSceneFade("scene-fade-in");
              setBubbleVisible(true);
              setSpeech(`Hi ${player.name}, choose a place to go!`);
            }, FADE_DURATION);
          }, 1000);
        }, BUBBLE_DURATION);
      }, BUBBLE_DELAY);
    }, FADE_DURATION);
  }

  const { hour } = getTimeParts(timeStr);

  // --- Player Setup Form (before menu) ---
  if (!playerReady) {
    return (
      <div className="player-setup-bg">
        <img
          src="/buildings/game.jpg"
          alt="Background"
          className="player-setup-bgimg"
        />
        <form
          className="player-setup-form transparent"
          onSubmit={(e) => {
            e.preventDefault();
            if (
              playerSetup.name.trim().length > 0 &&
              playerSetup.age &&
              Number(playerSetup.age) > 18 &&
              playerSetup.gender
            ) {
              handlePlayerSetup(e);
            }
          }}
          autoComplete="off"
        >
          <h2 className="player-setup-title">
            Welcome, to FinSim....save money live better!!!!
          </h2>
          <label className="player-setup-label">
            Name:
            <input
              required
              className="player-setup-input"
              value={playerSetup.name}
              onChange={(e) =>
                setPlayerSetup((s) => ({ ...s, name: e.target.value }))
              }
              placeholder="Enter your name"
              autoFocus
            />
          </label>
          <label className="player-setup-label">
            Age:
            <input
              required
              className="player-setup-input"
              type="number"
              min={19}
              value={playerSetup.age}
              onBlur={(e) =>
                setPlayerSetup((s) => ({ ...s, ageTouched: true }))
              }
              onChange={(e) =>
                setPlayerSetup((s) => ({
                  ...s,
                  age: e.target.value.replace(/[^0-9]/g, ""),
                }))
              }
              placeholder="Must be above 18"
            />
            {playerSetup.ageTouched &&
              playerSetup.age &&
              Number(playerSetup.age) <= 18 && (
                <span className="player-setup-age-error">
                  Age must be strictly above 18.
                </span>
              )}
          </label>
          <div className="player-setup-label" style={{ marginBottom: 8 }}>
            Gender:
            <div className="player-setup-gender-row">
              <div
                className={`player-setup-gender-block${
                  playerSetup.gender === "male" ? " selected" : ""
                }`}
                onClick={() =>
                  setPlayerSetup((s) => ({ ...s, gender: "male" }))
                }
                tabIndex={0}
                role="button"
                aria-label="Male"
              >
                <img
                  src="/assets/char-male.png"
                  alt="Male"
                  className="player-setup-gender-img"
                />
                <span className="player-setup-gender-label">Male</span>
              </div>
              <div
                className={`player-setup-gender-block${
                  playerSetup.gender === "female" ? " selected" : ""
                }`}
                onClick={() =>
                  setPlayerSetup((s) => ({ ...s, gender: "female" }))
                }
                tabIndex={0}
                role="button"
                aria-label="Female"
              >
                <img
                  src="/assets/char-female.png"
                  alt="Female"
                  className="player-setup-gender-img"
                />
                <span className="player-setup-gender-label">Female</span>
              </div>
              <div
                className={`player-setup-gender-block${
                  playerSetup.gender === "other" ? " selected" : ""
                }`}
                onClick={() =>
                  setPlayerSetup((s) => ({ ...s, gender: "other" }))
                }
                tabIndex={0}
                role="button"
                aria-label="Other"
              >
                <img
                  src="/assets/char-other.png"
                  alt="Other"
                  className="player-setup-gender-img"
                />
                <span className="player-setup-gender-label">Other</span>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="player-setup-btn"
            disabled={
              !(
                playerSetup.name.trim().length > 0 &&
                playerSetup.age &&
                Number(playerSetup.age) > 18 &&
                playerSetup.gender
              )
            }
          >
            Start Game
          </button>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Montserrat:wght@400;700&display=swap"
            rel="stylesheet"
          />
        </form>
      </div>
    );
  }

  // --- Main Scenes ---
  if (location === "menu") {
    return (
      <div className={`menu-scene-container fullscreen ${sceneFade}`}>
        <img src="/buildings/menu.jpg" alt="City" className="menu-scene-bg" />
        {statusBar}
        <div
          className={`bubble-msg ${
            bubbleVisible ? "bubble-fade-in" : "bubble-fade-out"
          }`}
        >
          {speech}
        </div>
        <div className="menu-player-bubble">
          <img
            src={
              player.gender === "female"
                ? "/assets/char-female.png"
                : "/assets/char-male.png"
            }
            alt={player.gender}
            className="menu-player-img"
          />
          <div>
            <div className="player-name">{player.name}</div>
            <div>Age: {player.age}</div>
            <div>Character: {player.gender}</div>
          </div>
        </div>
        {PLACES.map((item) => (
          <button
            key={item.id}
            className={`menu-item-btn${
              !menuEnabled(item, hour, weekday) ? " menu-item-disabled" : ""
            }`}
            style={item.style}
            onClick={
              menuEnabled(item, hour, weekday)
                ? () => handlePlace(item.id)
                : undefined
            }
            aria-label={item.label}
            disabled={!menuEnabled(item, hour, weekday)}
          >
            <img src={item.img} alt={item.label} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    );
  } else {
    const place = PLACES.find((p) => p.id === location);
    return (
      <div className={`menu-scene-container fullscreen ${sceneFade}`}>
        <img src={place.bg} alt={place.label} className="menu-scene-bg" />
        {statusBar}
        <div
          className={`bubble-msg ${
            bubbleVisible ? "bubble-fade-in" : "bubble-fade-out"
          }`}
        >
          {speech}
        </div>
        <div className="menu-player-bubble">
          <img
            src={
              player.gender === "female"
                ? "/assets/char-female.png"
                : "/assets/char-male.png"
            }
            alt={player.gender}
            className="menu-player-img"
          />
          <div>
            <div className="player-name">{player.name}</div>
            <div>Age: {player.age}</div>
            <div>Character: {player.gender}</div>
          </div>
        </div>
      </div>
    );
  }
}
