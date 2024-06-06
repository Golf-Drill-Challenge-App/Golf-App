import { firebaseErrors } from "~/Constants";

export const clampNumber = (num, a, b) =>
  Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));

export function formatDate(unixTimestamp) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  if (typeof unixTimestamp === "string")
    unixTimestamp = parseInt(unixTimestamp, 10);
  const date = new Date(unixTimestamp);

  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = date.getDate();

  return `${month} ${day}, ${year}`;
}

export function numTrunc(value, pad = false) {
  if (value === undefined) return "aaaaaaa";
  else if (value.toFixed === undefined) return value;
  else {
    const truncedValue = value.toFixed(3);
    return pad ? truncedValue : parseFloat(truncedValue);
  }
}

export function lookUpBaselineStrokesGained(value) {
  const sgKeys = [
    0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
    95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165,
    170, 175, 180, 185, 190, 195, 200, 210, 220, 230, 240, 250,
  ];
  const sgValues = [
    2.25, 2.25, 2.3, 2.35, 2.4, 2.45, 2.5, 2.55, 2.6, 2.625, 2.65, 2.68, 2.7,
    2.713, 2.73, 2.74, 2.75, 2.765, 2.78, 2.79, 2.8, 2.813, 2.825, 2.84, 2.85,
    2.865, 2.88, 2.895, 2.91, 2.93, 2.95, 2.965, 2.98, 3.005, 3.03, 3.055, 3.08,
    3.11, 3.14, 3.165, 3.19, 3.255, 3.32, 3.385, 3.45, 3.515,
  ];

  value = Math.ceil(value / 5) * 5;

  for (let i = 0; i < sgKeys.length; i++) {
    if (value < sgKeys[i]) {
      return sgValues[i - 1];
    }
  }
  console.log(
    "Distance Exceeded ceiling of strokes gained in lookUpBaselineStrokesGained",
  );
  return sgValues[sgValues.length - 1];
}
export function lookUpExpectedPutts(proxHole) {
  const putt_keys = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
    40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58,
    59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75,
  ];
  const putt_values = [
    0, 1.001, 1.009, 1.053, 1.147, 1.256, 1.357, 1.443, 1.515, 1.575, 1.626,
    1.669, 1.705, 1.737, 1.765, 1.79, 1.811, 1.83, 1.848, 1.863, 1.878, 1.891,
    1.903, 1.914, 1.924, 1.934, 1.944, 1.953, 1.961, 1.97, 1.978, 1.993, 1.993,
    2.001, 2.009, 2.016, 2.024, 2.032, 2.039, 2.047, 2.055, 2.062, 2.07, 2.078,
    2.086, 2.094, 2.102, 2.11, 2.118, 2.127, 2.135, 2.143, 2.152, 2.16, 2.168,
    2.177, 2.185, 2.193, 2.202, 2.21, 2.218, 2.226, 2.234, 2.242, 2.25, 2.257,
    2.265, 2.272, 2.279, 2.286, 2.293, 2.299, 2.306, 2.312, 2.318, 2.324,
  ];

  proxHole = Math.round(proxHole);

  for (let i = 0; i < putt_keys.length; i++) {
    if (proxHole < putt_keys[i]) {
      return putt_values[i - 1];
    }
  }
  //If the prox hole exceeds the expected putts range, convert to yards
  const proxHoleInYards = proxHole / 3;

  return lookUpBaselineStrokesGained(proxHoleInYards);
}

export function getIconByKey(key) {
  const icons = {
    carry: "arrow-up",
    sideLanding: "arrow-left-right",
    strokes: "pound",
    distance: "ruler",
    completed: "check",
    default: "help",
  };

  return icons[key] || icons.default;
}

export function getInitials(fullName) {
  const nameParts = fullName.trim().split(/\s+/);
  return nameParts.map((part) => part.charAt(0).toUpperCase()).join("");
}

export function getErrorString(error) {
  if (error.code) {
    if (firebaseErrors[error.code]) {
      return firebaseErrors[error.code];
    } else {
      return error.code;
    }
  } else {
    return String(error);
  }
}

export function getOffset(timeZone) {
  const timeZoneName = Intl.DateTimeFormat("ia", {
    timeZoneName: "shortOffset",
    timeZone,
  })
    .formatToParts()
    .find((i) => i.type === "timeZoneName").value;
  const offset = timeZoneName.slice(3);
  if (!offset) return 0;

  const matchData = offset.match(/([+-])(\d+)(?::(\d+))?/);
  if (!matchData) throw `cannot parse timezone name: ${timeZoneName}`;

  const [, sign, hour, minute] = matchData;
  let result = parseInt(hour) * 60;
  if (sign === "+") result *= -1;
  if (minute) result += parseInt(minute);

  return result;
}

export function getTimezoneOffsetTime(time) {
  const timezoneOffset = getOffset("US/Pacific") * 60000;
  // Divisor 3600000 = 1000 milliseconds * 60 seconds * 60 minutes)
  // If you want to see timezone offset in minutes instead, set Divisor = 60000
  console.log("UTC TIMEZONE OFFSET IN HOURS: " + timezoneOffset / 3600000);
  const localTime = time - timezoneOffset;
  return Math.floor(localTime / 86400000) * 86400000 + timezoneOffset;
}
