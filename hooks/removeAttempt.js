import { deleteDoc, doc } from "firebase/firestore";
import { db } from "~/firebaseConfig";
export const removeAttempt = async ({ currentTeamId, attemptId = null }) => {
  if (attemptId) {
    const attemptDoc = doc(db, "teams", currentTeamId, "attempts", attemptId);
    await deleteDoc(attemptDoc);
  }
};
