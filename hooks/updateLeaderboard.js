import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
export const updateLeaderboard = async ({
  currentTeamId,
  drillId = null,
  userId = null,
  value = null,
}) => {
  if (userId) {
    //update a user's best after an attempt
    const leaderboardRef = doc(
      db,
      "teams",
      currentTeamId,
      "best_attempts",
      drillId,
    );

    const changedObj = {};
    Object.keys(value).forEach((key) => {
      changedObj[`${userId}.${key}`] = value[key];
    });

    return updateDoc(leaderboardRef, changedObj);
  } else {
    //update the leaderboard after a new field is added, or initialize the leaderboard
    const leaderboardRef = doc(
      db,
      "teams",
      currentTeamId,
      "best_attempts",
      drillId,
    );
    return updateDoc(leaderboardRef, value);
  }
};
