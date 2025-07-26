import React, { useState } from "react";
import "../App.css";

// --- DATA ---
const INIT_PURSE = 400; // Reduced starting money to make it more challenging
const INIT_HAPPINESS = 50;
const WORK_PAY = 300; // Reduced base pay to balance the economy
const FADE_DURATION = 1500;
const BUBBLE_DELAY = 1200;
const BUBBLE_DURATION = 2500;

// Game Over/Win Conditions - Made more achievable
const BANKRUPTCY_THRESHOLD = 0;
const MIN_HAPPINESS = 0;
const WIN_MONEY_TARGET = 3000; // Reduced from 5000 to make it achievable
const WIN_HAPPINESS_TARGET = 80; // Reduced from 90 to make it achievable
const DAILY_RENT = 30; // Reduced from 50 to give more breathing room
const MAX_DAYS_TO_WIN = 21; // 3 weeks to achieve the goal

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
    bg: "/buildings/home.png",
    img: "/buildings/home.png",
    style: { left: "50%", top: "75%" },
  },
  {
    id: "work",
    label: "Work (MNC)",
    bg: "/buildings/work.png",
    img: "/buildings/work.png",
    style: { left: "45%", top: "10%" },
  },
  {
    id: "gym",
    label: "Planet Fitness",
    bg: "/buildings/gym.png",
    img: "/buildings/gym.png",
    style: { left: "14%", bottom: "10%" },
  },
  {
    id: "pub",
    label: "Downtown Pub",
    bg: "/buildings/pub.png",
    img: "/buildings/pub.png",
    style: { left: "75%", top: "20%" },
  },
  {
    id: "cn-tower",
    label: "CN Tower",
    bg: "/buildings/cn-tower.png",
    img: "/buildings/cn-tower.png",
    style: { left: "63%", bottom: "50%" },
  },
  {
    id: "mall",
    label: "Westfield Mall",
    bg: "/buildings/menu.jpg", // Using menu background as placeholder
    img: "/buildings/home.png", // Using home icon as placeholder
    style: { left: "80%", bottom: "35%" },
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

// Random Events - Balanced for new economy
const RANDOM_EVENTS = [
  {
    type: "bonus",
    message: "Great performance! Your boss gave you a $150 bonus!",
    amount: 150,
    probability: 0.1,
  },
  {
    type: "expense",
    message: "Oops! Your phone screen cracked. Repair cost: $60",
    amount: 60,
    probability: 0.15,
  },
  {
    type: "expense",
    message: "Car maintenance required. Cost: $90",
    amount: 90,
    probability: 0.12,
  },
  {
    type: "bonus",
    message: "Found $35 in your old jacket pocket!",
    amount: 35,
    probability: 0.08,
  },
  {
    type: "expense",
    message: "Parking ticket! You have to pay $30",
    amount: 30,
    probability: 0.1,
  },
  {
    type: "bonus",
    message: "Cashback from your credit card: $25!",
    amount: 25,
    probability: 0.15,
  },
  {
    type: "bonus",
    message: "Your side project earned you $120!",
    amount: 120,
    probability: 0.05,
  },
  {
    type: "expense",
    message: "Medical checkup cost: $45",
    amount: 45,
    probability: 0.08,
  },
];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function playSound(type) {
  let url = "";
  if (type === "click") url = "/assets/click.mp3";
  if (type === "credit") url = "/assets/credit.mp3";
  if (type === "debit") url = "/assets/debit.mp3";
  if (type === "gameover") url = "/assets/gameover.mp3";
  if (type === "win") url = "/assets/win.mp3";
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
function formatTime12Hour(timeStr) {
  const { hour, min } = getTimeParts(timeStr);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${hour12}:${pad(min)} ${period}`;
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
    fitness: 50,
    daysPlayed: 0,
    skillBonus: 0,
  });
  const [weekday, setWeekday] = useState("Wednesday");
  const [timeStr, setTimeStr] = useState("08:30");
  const [gameStatus, setGameStatus] = useState("playing"); // "playing", "won", "lost"

  // Game mechanics functions
  const checkWinCondition = (money, happiness) => {
    if (money >= WIN_MONEY_TARGET && happiness >= WIN_HAPPINESS_TARGET) {
      setGameStatus("won");
      playSound("win");
    }
  };

  const checkTimeLimit = (daysPlayed) => {
    if (daysPlayed >= MAX_DAYS_TO_WIN) {
      setGameStatus("lost");
      playSound("gameover");
      setSpeech(
        `Time's up! You had ${MAX_DAYS_TO_WIN} days to achieve your goals but didn't make it in time.`
      );
    }
  };

  const triggerRandomEvent = () => {
    const randomChance = Math.random();
    let cumulativeProbability = 0;

    for (const event of RANDOM_EVENTS) {
      cumulativeProbability += event.probability;
      if (randomChance < cumulativeProbability) {
        return event;
      }
    }
    return null;
  };

  const updateHappiness = (change) => {
    setPlayer((prev) => {
      const newHappiness = Math.max(0, Math.min(100, prev.happiness + change));
      if (newHappiness <= MIN_HAPPINESS) {
        setGameStatus("lost");
        playSound("gameover");
      } else {
        checkWinCondition(purse, newHappiness);
      }
      return { ...prev, happiness: newHappiness };
    });
  };

  const updateFitness = (change) => {
    setPlayer((prev) => ({
      ...prev,
      fitness: Math.max(0, Math.min(100, prev.fitness + change)),
    }));
  };

  const payDailyRent = () => {
    if (purse >= DAILY_RENT) {
      debitMoney(DAILY_RENT);
      return `Daily rent paid: $${DAILY_RENT}`;
    } else {
      setGameStatus("lost");
      playSound("gameover");
      return "You can't afford rent! Game Over!";
    }
  };

  const restartGame = () => {
    setGameStatus("playing");
    setPurse(INIT_PURSE);
    setPlayer((prev) => ({
      ...prev,
      happiness: INIT_HAPPINESS,
      fitness: 50,
      daysPlayed: 0,
      skillBonus: 0,
    }));
    setWeekday("Wednesday");
    setTimeStr("08:30");
    setLocation("menu");
    setSpeech(`Hi ${player.name}, choose a place to go!`);
  };

  // Setup form submit
  function handlePlayerSetup(e) {
    e.preventDefault();
    setPlayer({
      name: playerSetup.name,
      age: playerSetup.age,
      gender: playerSetup.gender,
      happiness: INIT_HAPPINESS,
      fitness: 50,
      daysPlayed: 0,
      skillBonus: 0,
    });
    setPlayerReady(true);
    setSpeech(`Hi ${playerSetup.name}, choose a place to go!`);
  }

  function animatePurse(type) {
    setPurseAnim(type);
    setTimeout(() => setPurseAnim(null), 1000);
  }

  function creditMoney(val) {
    setPurse((p) => {
      const newAmount = p + val;
      checkWinCondition(newAmount, player.happiness);
      return newAmount;
    });
    animatePurse("credit");
    playSound("credit");
  }

  function debitMoney(val) {
    setPurse((p) => {
      const newAmount = Math.max(0, p - val);
      if (newAmount <= BANKRUPTCY_THRESHOLD) {
        setGameStatus("lost");
        playSound("gameover");
      }
      return newAmount;
    });
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
        <b>{formatTime12Hour(timeStr)} (EST)</b>
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
      <span className="menu-fitness">
        <b>💪 {player.fitness}%</b>
      </span>
      <span className="menu-days">
        <b>📅 Day {player.daysPlayed}</b>
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
          const rentMsg = payDailyRent();
          setSpeech(getRandom(HOME_QUOTES) + "\n" + rentMsg);
          setTimeStr("22:00");

          // Trigger random event
          const randomEvent = triggerRandomEvent();
          if (randomEvent) {
            setTimeout(() => {
              if (randomEvent.type === "bonus") {
                creditMoney(randomEvent.amount);
              } else {
                debitMoney(randomEvent.amount);
              }
              setSpeech(randomEvent.message);
            }, 1500);
          }

          // After night bubble, fade out, then show morning bubble
          setTimeout(() => {
            setBubbleVisible(false);
            setSceneFade("scene-fade-out");
            setTimeout(() => {
              setSceneFade("scene-fade-in");
              setBubbleVisible(true);
              setSpeech(getRandom(MORNING_QUOTES));
              setWeekday(nextWeekday(weekday));
              setTimeStr("08:30"); // Fixed: Set to 8:30 AM after sleeping
              setPlayer((prev) => {
                const newDaysPlayed = prev.daysPlayed + 1;
                checkTimeLimit(newDaysPlayed); // Check if time limit exceeded
                return {
                  ...prev,
                  daysPlayed: newDaysPlayed,
                };
              });

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
        let basePay = WORK_PAY;
        let performanceBonus = 0;
        let skillBonus = player.skillBonus || 0;

        // Happiness affects performance
        if (player.happiness > 70) {
          performanceBonus = 80;
        } else if (player.happiness > 50) {
          performanceBonus = 40;
        }

        // Fitness affects productivity
        if (player.fitness > 70) {
          performanceBonus += 30;
        }

        const totalPay = basePay + performanceBonus + skillBonus;

        let payBreakdown = `💼 ${getRandom(MOTIVATIONAL_QUOTES)}\n\n`;
        payBreakdown += `Base salary: $${basePay}\n`;

        if (performanceBonus > 0) {
          payBreakdown += `Performance bonus: $${performanceBonus}\n`;
        }
        if (skillBonus > 0) {
          payBreakdown += `Skill bonus: $${skillBonus}\n`;
          // Reset skill bonus after using it
          setPlayer((prev) => ({ ...prev, skillBonus: 0 }));
        }

        payBreakdown += `\n💰 Total earned: $${totalPay}`;

        // Add strategic hints
        if (player.happiness < 50) {
          payBreakdown += `\n\n💡 Tip: Higher happiness = better performance!`;
        }
        if (player.fitness < 50) {
          payBreakdown += `\n\n💡 Tip: Stay fit for productivity bonuses!`;
        }

        bubbleMsg = payBreakdown;

        updateFn = () => {
          creditMoney(totalPay);
          updateHappiness(-3); // Reduced work stress
          setTimeStr("18:00");
        };
      } else if (id === "gym") {
        const gasCost = getRandom([3, 4, 5]);
        const gymFee = getRandom([8, 10, 12, 15]);
        const fitnessGain = getRandom([10, 12, 15, 18]);
        bubbleMsg =
          `💪 ${getRandom(MOTIVATIONAL_QUOTES)} (${getRandom(
            EXERCISE_DAYS
          )})\n\n` +
          `🚗 Gas: $${gasCost}\n` +
          `🏋️ Gym fee: $${gymFee}\n` +
          `💪 Fitness increased by ${fitnessGain}%!\n` +
          `😊 Feeling great after workout!`;
        updateFn = () => {
          debitMoney(gasCost);
          debitMoney(gymFee);
          updateHappiness(12); // Exercise makes you happy
          updateFitness(fitnessGain);
          setTimeStr(addMinutes(timeStr, 90));
        };
      } else if (id === "pub") {
        const pubCost = getRandom([15, 20, 25, 30]);
        const happinessGain = getRandom([18, 22, 28]);
        bubbleMsg =
          `🍻 Enjoying the night at the pub with friends!\n\n` +
          `💰 Cost: $${pubCost}\n` +
          `😊 Happiness increased by ${happinessGain}%!\n` +
          `🎉 Great way to unwind and socialize!`;
        updateFn = () => {
          debitMoney(pubCost);
          updateHappiness(happinessGain);
          updateFitness(-3); // Reduced fitness loss
          setTimeStr(addMinutes(timeStr, 120));
        };
      } else if (id === "cn-tower") {
        const happinessGain = getRandom([15, 18, 22]);
        bubbleMsg =
          `🗼 Exploring CN Tower! The city looks amazing from up here.\n\n` +
          `🎫 Entry fee: $25\n` +
          `😊 Happiness increased by ${happinessGain}%!\n` +
          `📸 Such breathtaking views of Toronto!`;
        updateFn = () => {
          debitMoney(25); // Reduced from 30
          updateHappiness(happinessGain);
          setTimeStr(addMinutes(timeStr, 60));
        };
      } else if (id === "mall") {
        // Enhanced Shopping Mall with strategic choices
        const shoppingOptions = [
          {
            category: "Essential Items",
            items: [
              {
                name: "Groceries & Food",
                cost: 45,
                happiness: 8,
                description: "Weekly essentials",
              },
              {
                name: "Personal Care",
                cost: 25,
                happiness: 5,
                description: "Hygiene products",
              },
              {
                name: "Home Supplies",
                cost: 35,
                happiness: 6,
                description: "Cleaning & utilities",
              },
            ],
          },
          {
            category: "Lifestyle & Fashion",
            items: [
              {
                name: "Trendy Outfit",
                cost: 85,
                happiness: 18,
                description: "Boost your confidence",
              },
              {
                name: "Designer Accessories",
                cost: 120,
                happiness: 22,
                description: "Premium style items",
              },
              {
                name: "Seasonal Wardrobe",
                cost: 65,
                happiness: 15,
                description: "Weather-appropriate clothes",
              },
            ],
          },
          {
            category: "Tech & Entertainment",
            items: [
              {
                name: "Smartphone Upgrade",
                cost: 180,
                happiness: 25,
                description: "Latest tech features",
              },
              {
                name: "Gaming Console",
                cost: 250,
                happiness: 35,
                description: "Entertainment system",
              },
              {
                name: "Wireless Earbuds",
                cost: 95,
                happiness: 16,
                description: "Premium audio experience",
              },
            ],
          },
          {
            category: "Investment Items",
            items: [
              {
                name: "Online Course",
                cost: 75,
                happiness: 12,
                description: "Skill development (may increase work bonus)",
              },
              {
                name: "Business Books",
                cost: 40,
                happiness: 8,
                description: "Financial knowledge",
              },
              {
                name: "Networking Event Ticket",
                cost: 55,
                happiness: 10,
                description: "Career opportunities",
              },
            ],
          },
        ];

        const selectedCategory = getRandom(shoppingOptions);
        const selectedItem = getRandom(selectedCategory.items);

        // Add some randomness to prices (±20%)
        const priceVariation = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
        const finalCost = Math.round(selectedItem.cost * priceVariation);

        bubbleMsg =
          `🛍️ Welcome to ${selectedCategory.category}!\n\n` +
          `You found: ${selectedItem.name}\n` +
          `${selectedItem.description}\n` +
          `💰 Cost: $${finalCost}\n` +
          `😊 Happiness: +${selectedItem.happiness}%`;

        updateFn = () => {
          debitMoney(finalCost);
          updateHappiness(selectedItem.happiness);

          // Special bonus for investment items - chance to increase future work performance
          if (
            selectedCategory.category === "Investment Items" &&
            Math.random() < 0.3
          ) {
            setPlayer((prev) => ({
              ...prev,
              skillBonus: (prev.skillBonus || 0) + 50, // Will be used in work calculations
            }));
          }

          setTimeStr(addMinutes(timeStr, 90)); // Shopping takes time
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

  // --- Game Over/Win Screens ---
  if (gameStatus === "won") {
    return (
      <div className="game-end-screen">
        <div className="game-end-content">
          <h1 className="game-end-title">🎉 CONGRATULATIONS! 🎉</h1>
          <p className="game-end-message">
            You've successfully achieved financial stability and happiness!
          </p>
          <div className="game-end-stats">
            <p>💰 Final Money: ${purse}</p>
            <p>😊 Final Happiness: {player.happiness}%</p>
            <p>💪 Final Fitness: {player.fitness}%</p>
            <p>📅 Days Played: {player.daysPlayed}</p>
          </div>
          <button className="game-end-button" onClick={restartGame}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  if (gameStatus === "lost") {
    let lossReason = "";
    if (purse <= BANKRUPTCY_THRESHOLD) {
      lossReason = "You ran out of money and couldn't pay your bills!";
    } else if (player.happiness <= MIN_HAPPINESS) {
      lossReason = "Your happiness dropped to zero. Life became unbearable.";
    } else if (player.daysPlayed >= MAX_DAYS_TO_WIN) {
      lossReason = `Time's up! You had ${MAX_DAYS_TO_WIN} days to reach your goals.`;
    } else {
      lossReason = "Game over!";
    }

    return (
      <div className="game-end-screen game-over">
        <div className="game-end-content">
          <h1 className="game-end-title">💸 GAME OVER 💸</h1>
          <p className="game-end-message">{lossReason}</p>

          {/* Strategic advice based on how they lost */}
          <div className="game-advice">
            {purse <= BANKRUPTCY_THRESHOLD && (
              <p>
                💡 Next time: Balance spending with earning. Work more when
                happy!
              </p>
            )}
            {player.happiness <= MIN_HAPPINESS && (
              <p>
                💡 Next time: Maintain happiness by visiting fun places and
                avoiding overwork!
              </p>
            )}
            {player.daysPlayed >= MAX_DAYS_TO_WIN && (
              <p>
                💡 Next time: Focus on high-paying work when fit & happy. Invest
                in skills!
              </p>
            )}
          </div>

          <div className="game-end-stats">
            <p>
              💰 Final Money: ${purse} (Goal: ${WIN_MONEY_TARGET})
            </p>
            <p>
              😊 Final Happiness: {player.happiness}% (Goal:{" "}
              {WIN_HAPPINESS_TARGET}%)
            </p>
            <p>💪 Final Fitness: {player.fitness}%</p>
            <p>
              📅 Days Survived: {player.daysPlayed}/{MAX_DAYS_TO_WIN}
            </p>
          </div>
          <button className="game-end-button" onClick={restartGame}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // --- Player Setup Form (before menu) ---
  if (!playerReady) {
    return (
      <div className="modern-setup-container">
        <div className="setup-bg-overlay"></div>
        <img
          src="/buildings/game.jpg"
          alt="Background"
          className="setup-bg-image"
        />

        {/* Animated Background Elements */}
        <div className="floating-elements">
          <div className="floating-icon floating-money">💰</div>
          <div className="floating-icon floating-chart">📈</div>
          <div className="floating-icon floating-house">🏠</div>
          <div className="floating-icon floating-car">🚗</div>
          <div className="floating-icon floating-target">🎯</div>
        </div>

        <div className="setup-content">
          {/* Header Section */}
          <div className="setup-header">
            <div className="logo-container">
              <div className="logo-icon">💎</div>
              <h1 className="game-title">
                <span className="title-fin">Fin</span>
                <span className="title-sim">Sim</span>
              </h1>
            </div>
            <p className="game-tagline">Master Your Financial Future</p>
            <div className="tagline-subtext">
              💰 Save Smart • 📊 Invest Wisely • 🎯 Live Better
            </div>
          </div>

          {/* Form Section */}
          <form
            className="modern-setup-form"
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
            {/* Name Input */}
            <div className="input-group">
              <div className="input-icon">👤</div>
              <div className="input-container">
                <input
                  required
                  className="modern-input"
                  value={playerSetup.name}
                  onChange={(e) =>
                    setPlayerSetup((s) => ({ ...s, name: e.target.value }))
                  }
                  placeholder="Enter your name"
                  autoFocus
                />
                <label className="floating-label">Your Name</label>
              </div>
            </div>

            {/* Age Input */}
            <div className="input-group">
              <div className="input-icon">🎂</div>
              <div className="input-container">
                <input
                  required
                  className="modern-input"
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
                  placeholder="Your age"
                />
                <label className="floating-label">Age (18+)</label>
                {playerSetup.ageTouched &&
                  playerSetup.age &&
                  Number(playerSetup.age) <= 18 && (
                    <div className="error-message">
                      <span className="error-icon">⚠️</span>
                      Age must be above 18 to play
                    </div>
                  )}
              </div>
            </div>

            {/* Gender Selection */}
            <div className="gender-section">
              <h3 className="section-title">Choose Your Avatar</h3>
              <div className="gender-options">
                <div
                  className={`gender-card ${
                    playerSetup.gender === "male" ? "selected" : ""
                  }`}
                  onClick={() =>
                    setPlayerSetup((s) => ({ ...s, gender: "male" }))
                  }
                  tabIndex={0}
                  role="button"
                  aria-label="Male Avatar"
                >
                  <div className="avatar-container">
                    <img
                      src="/assets/char-male.png"
                      alt="Male Avatar"
                      className="avatar-image"
                    />
                    <div className="avatar-glow"></div>
                  </div>
                  <span className="avatar-label">Male</span>
                  <div className="selection-indicator">✓</div>
                </div>

                <div
                  className={`gender-card ${
                    playerSetup.gender === "female" ? "selected" : ""
                  }`}
                  onClick={() =>
                    setPlayerSetup((s) => ({ ...s, gender: "female" }))
                  }
                  tabIndex={0}
                  role="button"
                  aria-label="Female Avatar"
                >
                  <div className="avatar-container">
                    <img
                      src="/assets/char-female.png"
                      alt="Female Avatar"
                      className="avatar-image"
                    />
                    <div className="avatar-glow"></div>
                  </div>
                  <span className="avatar-label">Female</span>
                  <div className="selection-indicator">✓</div>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              type="submit"
              className={`start-game-btn ${
                playerSetup.name.trim().length > 0 &&
                playerSetup.age &&
                Number(playerSetup.age) > 18 &&
                playerSetup.gender
                  ? "ready"
                  : "disabled"
              }`}
              disabled={
                !(
                  playerSetup.name.trim().length > 0 &&
                  playerSetup.age &&
                  Number(playerSetup.age) > 18 &&
                  playerSetup.gender
                )
              }
            >
              <span className="btn-text">Start Your Journey</span>
              <span className="btn-icon">🚀</span>
            </button>
          </form>

          {/* Footer */}
          <div className="setup-footer">
            <div className="feature-highlights">
              <div className="feature">
                <span className="feature-icon">🎮</span>
                <span>Interactive Gameplay</span>
              </div>
              <div className="feature">
                <span className="feature-icon">📊</span>
                <span>Real-world Scenarios</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🏆</span>
                <span>Achievement System</span>
              </div>
            </div>
          </div>
        </div>
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
            <div className="player-goal">
              🎯 Goal: ${WIN_MONEY_TARGET} & {WIN_HAPPINESS_TARGET}% happiness
            </div>
            <div className="player-progress">
              ⏰ Time limit: {MAX_DAYS_TO_WIN - player.daysPlayed} days left
            </div>
            <div className="player-strategy">
              💡 Strategy: Work when happy & fit for max pay!
            </div>
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
