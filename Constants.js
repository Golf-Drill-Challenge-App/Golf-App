const themeColors = {
  accent: "#F24E1E",
  background: "#f2f2f2",
  border: "#ddd",
  avatar: "#A0A0A0",
  overlay: "rgba(242,78,30,0.38)",
  highlight: "#fff",
};

const TESTING = true;

const prettyTitle = {
  target: "Target",
  sideLanding: "Side Landing",
  proxHole: "Proximity to Hole",
  baseline: "Baseline SG",
  expectedPutts: "Expected Putts",
  strokes: "Strokes",
  break: "Break",
  club: "Club",
  carry: "Carry",
  completed: "Completed",
  carryDiff: "Carry Difference",
  distance: "Distance",
  carryDiffAverage: "Carry Difference Average",
  proxHoleAverage: "Proximity-to-hole Average",
  sideLandingAverage: "Side Landing Average",
  leftSideLandingAverage: "Average Miss Left",
  rightSideLandingAverage: "Average Miss Right",
  sideLandingTotal: "Side Landing Total",
  strokesGained: "Strokes Gained Total",
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
  rightSideLandingAverage: "AMR",
  leftSideLandingAverage: "AML",
};

const prettyRole = {
  coach: "Coach",
  player: "Player",
  owner: "Owner",
};

const firebaseErrors = {
  "auth/email-already-in-use": "Email is already in use",
  "auth/invalid-email": "Incorrect email / password",
  "auth/weak-password": "Password is too weak",
  "auth/user-not-found": "User not found",
  "auth/wrong-password": "Incorrect email / password",
  "auth/missing-email": "Missing email",
  "auth/missing-password": "Missing password",
};
export {
  TESTING,
  firebaseErrors,
  prettyRole,
  prettyTitle,
  shortTitle,
  themeColors,
};
