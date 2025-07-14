import React, { useState, useEffect } from "react";
import PlayerIntro from "./PlayerIntro";
import BuildingMap from "./BuildingMap";
import SpeechBubble from "./SpeechBubble";
import Purse from "./Purse";
import Character from "./Character";
import AnimationLayer from "./AnimationLayer";
import { playSound } from "../sounds";
import {
  getESTDate,
  getWeekday,
  getTimeString,
  getRandom,
  getRandomCost,
} from "../utils";

const INIT_PURSE = 500;
const WORK_PAY = 500;

const MOTIVATIONAL_QUOTES = [
  "Success is no accident.",
  "Dream big. Work hard.",
  "Don’t watch the clock; do what it does. Keep going.",
  "Hard work pays off.",
  "Great things never come from comfort zones.",
];

export default function Game() {
  // Game States
  const [player, setPlayer] = useState(null);
  const [purse, setPurse] = useState(INIT_PURSE);
  const [location, setLocation] = useState("home"); // home, work, gym, pub, cn-tower
  const [time, setTime] = useState(getESTDate());
  const [activity, setActivity] = useState(""); // sleep, work, gym, pub, sightseeing, etc.
  const [speech, setSpeech] = useState("");
  const [weekday, setWeekday] = useState(getWeekday(time));
  const [gamePhase, setGamePhase] = useState("intro"); // intro, day, sleep, end
  const [dayCount, setDayCount] = useState(1); // 1=Monday
  const [weekCount, setWeekCount] = useState(1);
  const [purseAnim, setPurseAnim] = useState(null); // 'credit'/'debit'
  const [showChoice, setShowChoice] = useState(false);
  const [gameResult, setGameResult] = useState(null); // null, 'win', 'lose'

  // --- Time management ---
  // Sync time to EST, update on new day
  useEffect(() => {
    setWeekday(getWeekday(time));
  }, [time]);

  // --- On player intro complete ---
  function handlePlayerIntro(playerObj) {
    setPlayer(playerObj);
    setSpeech(
      `Hi, I'm ${playerObj.name}, a ${playerObj.age}-year-old ${
        playerObj.gender
      }. Today is ${weekday}, ${getTimeString(time)} (EST).`
    );
    setTimeout(() => setGamePhase("choose-start"), 3000);
  }

  // --- Main game day flow ---
  useEffect(() => {
    if (gamePhase === "choose-start") {
      setShowChoice(true);
      setSpeech("Choose your starting building for today!");
    }
    if (gamePhase === "sleep") {
      setActivity("sleep");
      setSpeech("Sleeping ... Zzz");
      playSound("bgm");
      setTimeout(() => {
        setActivity("wake");
        setSpeech("Good morning! It's a new day.");
        setTime(getESTDate(7, 0, weekCount, dayCount + 1)); // Next day, 7:00 am
        setDayCount((prev) => (prev < 7 ? prev + 1 : 1));
        setTimeout(() => {
          setGamePhase("breakfast");
          setActivity("breakfast");
          setSpeech("Had breakfast. Ready for the day! Time: 8:30am (EST)");
          setTime(getESTDate(8, 30, weekCount, dayCount));
          setTimeout(() => {
            if (dayCount <= 5) setGamePhase("work-commute");
            else setGamePhase("choose-activity");
          }, 2000);
        }, 1500);
      }, 3000);
    }
    if (gamePhase === "work-commute") {
      setLocation("work");
      setActivity("commute");
      setSpeech("Heading to work...");
      playSound("debit");
      deductGas();
      setTimeout(() => {
        setActivity("work");
        setSpeech(`Working hard! "${getRandom(MOTIVATIONAL_QUOTES)}"`);
        playSound("bgm");
        setTimeout(() => {
          handleMoney(WORK_PAY, "credit");
          setSpeech("Work day complete! +$500. Time: 5:00pm (EST)");
          setTime(getESTDate(17, 0, weekCount, dayCount));
          setGamePhase("choose-gym-study");
        }, 3000);
      }, 1500);
    }
    if (gamePhase === "choose-gym-study") {
      setShowChoice(true);
      setSpeech("After work, do you want to go to the gym or study?");
    }
    if (gamePhase === "choose-activity") {
      setShowChoice(true);
      setSpeech("What will you do today? (study / cn tower / pub)");
    }
    if (gamePhase === "evening-choice") {
      setShowChoice(true);
      setSpeech("It's evening! Go home, visit the CN Tower, or go to the pub?");
    }
    if (gamePhase === "end-week") {
      setGamePhase("end");
      if (purse >= 2000) {
        setGameResult("win");
        setSpeech("Congratulations! You finished with great savings. You won!");
        playSound("win");
      } else {
        setGameResult("lose");
        setSpeech("Game over. Try to manage your spending better next time.");
        playSound("gameover");
      }
    }
  }, [gamePhase]);

  // --- Helper logic ---
  function handleMoney(amount, type) {
    setPurse((p) => {
      setPurseAnim(type);
      setTimeout(() => setPurseAnim(null), 1000);
      playSound(type === "credit" ? "credit" : "debit");
      return type === "credit" ? p + amount : p - amount;
    });
  }
  function deductGas() {
    const gasCost = getRandomCost(4, 6);
    handleMoney(gasCost, "debit");
    setSpeech(`Car gas today cost $${gasCost}.`);
  }

  // --- Building click logic ---
  function handleBuildingSelect(target) {
    setShowChoice(false);
    if (gamePhase === "choose-start") {
      setLocation(target);
      // If night, sleep logic
      const hour = time.getHours();
      if (hour >= 23 || hour < 5) {
        setGamePhase("sleep");
        return;
      }
      setSpeech("Let's start the day!");
      if (target === "home") setGamePhase("sleep");
      else if (target === "work" && dayCount <= 5) setGamePhase("work-commute");
      else setGamePhase("choose-activity");
    } else if (gamePhase === "choose-gym-study") {
      if (target === "gym") {
        setLocation("gym");
        const gymCost = getRandomCost(10, 20);
        handleMoney(gymCost, "debit");
        setActivity("gym");
        setSpeech(`Preworkout & gas: $${gymCost}. Let's get those gains!`);
        setTimeout(() => setGamePhase("evening-choice"), 1500);
      } else if (target === "study") {
        handleMoney(10, "debit");
        setActivity("study");
        setSpeech("Hit the books!");
        setTimeout(() => setGamePhase("evening-choice"), 1500);
      }
    } else if (gamePhase === "choose-activity") {
      if (target === "study") {
        handleMoney(10, "debit");
        setActivity("study");
        setSpeech("A productive day studying!");
        setTimeout(() => setGamePhase("evening-choice"), 1500);
      } else if (target === "cn-tower") {
        setLocation("cn-tower");
        handleMoney(30, "debit");
        setActivity("sightseeing");
        setSpeech(
          "Enjoying CN Tower! Next time, I'll explore even more. Worth it!"
        );
        setTimeout(() => setGamePhase("evening-choice"), 1500);
      } else if (target === "pub") {
        setLocation("pub");
        const pubCost =
          dayCount === 5 || dayCount === 6
            ? getRandomCost(40, 70)
            : getRandomCost(15, 25);
        handleMoney(pubCost, "debit");
        setActivity("pub");
        setSpeech("Having a blast at the pub! I love this vibe and music.");
        setTimeout(() => setGamePhase("evening-choice"), 1500);
      }
    } else if (gamePhase === "evening-choice") {
      if (target === "home") {
        deductGas();
        setActivity("night");
        setSpeech(
          `What a wonderful day! Can't wait for tomorrow. Final purse: $${purse}`
        );
        setTimeout(() => {
          if (dayCount === 6) setGamePhase("end-week");
          else setGamePhase("sleep");
        }, 2000);
      } else if (target === "cn-tower") {
        handleMoney(30, "debit");
        setActivity("sightseeing");
        setSpeech("Evening at CN Tower. Amazing city lights!");
        setTimeout(() => handleBuildingSelect("home"), 1500);
      } else if (target === "pub") {
        const pubCost =
          dayCount === 5 || dayCount === 6
            ? getRandomCost(40, 70)
            : getRandomCost(15, 25);
        handleMoney(pubCost, "debit");
        setActivity("pub");
        setSpeech("Enjoying the night at the pub with friends.");
        setTimeout(() => handleBuildingSelect("home"), 1500);
      }
    }
  }

  // --- Render ---
  if (gamePhase === "intro")
    return <PlayerIntro onComplete={handlePlayerIntro} />;
  if (gamePhase === "end")
    return (
      <div>
        <h2>{gameResult === "win" ? "You Win!" : "Game Over"}</h2>
        <p>Your final balance: ${purse}</p>
      </div>
    );

  return (
    <div className="game-main">
      <Purse amount={purse} anim={purseAnim} />
      <SpeechBubble>{speech}</SpeechBubble>
      <Character
        gender={player?.gender}
        activity={activity}
        location={location}
        time={time}
      />
      <BuildingMap
        current={location}
        onSelect={showChoice ? handleBuildingSelect : null}
        dayCount={dayCount}
        phase={gamePhase}
      />
      <AnimationLayer activity={activity} />
    </div>
  );
}
