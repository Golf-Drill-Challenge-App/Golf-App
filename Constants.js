const themeColors = {
  accent: "#F24E1E",
  background: "#f2f2f2",
  border: "#ddd",
  overlay: "rgba(242,78,30,0.38)",
  highlight: "#fff",
};

const prettyTitle = {
  target: "Target",
  sideLanding: "Side Landing",
  proxHole: "Proximity to Hole",
  baseline: "Baseline SG",
  expectedPutts: "Expected Putts",
  strokes: "Strokes",
  break: "Break",
  club: "Club",
  carryDiffAverage: "Carry Difference Average",
  proxHoleAverage: "Proximity-to-hole Average",
  sideLandingAverage: "Side Landing Average",
  sideLandingTotal: "Side Landing Total",
  strokesGained: "Strokes Gained",
  strokesGainedAverage: "Strokes Gained Average",
};

const shortTitle = {
  strokesGained: "SG",
  strokesGainedAverage: "SGA",
  sideLanding: "SL",
  carryDiffAverage: "CDA",
  proxHoleAverage: "PHA",
  sideLandingAverage: "SLA",
  sideLandingTotal: "SLT",
};

const firebaseErrors = {
  "auth/email-already-in-use": "Email is already in use",
  "auth/invalid-email": "Invalid email",
  "auth/weak-password": "Password is too weak",
  "auth/user-not-found": "User not found",
  "auth/wrong-password": "Incorrect password",
  "auth/missing-email": "Missing email",
  "auth/missing-password": "Missing password",
};
export { firebaseErrors, prettyTitle, shortTitle, themeColors };
