export default function Character({ gender, activity, location, time }) {
  // Use different sprite/outfit based on activity, location, and gender
  let img = "/assets/char-male.png";
  if (gender === "female") img = "/assets/char-female.png";
  // You can swap to .sleep, .work, .gym, .pub, .sightseeing etc. versions for more detail
  // For demo, just swap tint or overlay an icon
  return (
    <div className={`character ${activity}`}>
      <img src={img} alt={gender} style={{ width: 90, height: 120 }} />
      {activity === "sleep" && <span className="emoji">💤</span>}
      {activity === "work" && <span className="emoji">💻</span>}
      {activity === "gym" && <span className="emoji">🏋️</span>}
      {activity === "pub" && <span className="emoji">🍷</span>}
      {activity === "sightseeing" && <span className="emoji">🗼</span>}
      {activity === "study" && <span className="emoji">📚</span>}
    </div>
  );
}
