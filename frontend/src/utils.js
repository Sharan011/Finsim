// Converts to EST and returns JS Date
export function getESTDate(hour = null, min = null, week = 1, day = 1) {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset() - 300); // EST=UTC-5
  if (hour !== null) now.setHours(hour);
  if (min !== null) now.setMinutes(min);
  // Optionally adjust week/day for simulation
  return now;
}
export function getWeekday(date) {
  return [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][date.getDay()];
}
export function getTimeString(date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
export function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
export function getRandomCost(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
