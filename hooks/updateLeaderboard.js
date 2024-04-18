import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "~/firebaseConfig";
import { currentAuthContext } from "~/context/Auth";

export const updateLeaderboard = async ({
  drillId,
  userId = null,
  attemptId = null,
  value,
}) => {
  const { currentTeamId } = currentAuthContext();
  if (!currentTeamId || !drillId || !value) {
    console.log("currentTeamId, drillId, or value not passed in");
    return;
  }
  if (userId) {
    //update a user's best after an attempt. Only pass in values to update, don't pass in everything...

    const leaderboardRef = doc(
      db,
      "teams",
      currentTeamId,
      "best_attempts",
      drillId,
    );

    const changedObj = { userId: {} };
    Object.keys(value).forEach((key) => {
      changedObj[userId][key] = { value: value[key], id: attemptId };
    });

    return updateDoc(leaderboardRef, changedObj);
  } else {
    //update the leaderboard after a new field is added, or initialize the leaderboard with a certain field (only 1 field at a time as only 1 field is sorted at one time)
    const leaderboardRef = doc(
      db,
      "teams",
      currentTeamId,
      "best_attempts",
      drillId,
    );
    return setDoc(leaderboardRef, value, { merge: true });
  }
};
