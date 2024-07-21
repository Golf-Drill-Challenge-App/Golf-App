import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import removePfp from "~/dbOperations/removePfp";
import { db } from "~/firebaseConfig";
import { getPfpName } from "~/Utility";

async function removeUser(teamId, userId) {
  try {
    //Remove all attempts from attempts table with UID == userID
    const attemptQuery = query(
      collection(db, "teams", teamId, "attempts"),
      where("uid", "==", userId),
    );

    const attemptSnapshot = await getDocs(attemptQuery);

    for (const doc of attemptSnapshot.docs) {
      await deleteDoc(doc.ref);
    }

    //Remove all entries from best_attempts table with UID == userID
    const bestAttemptQuery = query(
      collection(db, "teams", teamId, "best_attempts"),
    );

    const bestAttemptSnapshot = await getDocs(bestAttemptQuery);

    for (const doc of bestAttemptSnapshot.docs) {
      const docData = doc.data();

      if (docData[userId]) {
        //Delete the field
        await updateDoc(doc.ref, {
          [userId]: deleteField(),
        });
      }
    }

    //Remove user from user table where UID == userID
    const userRef = doc(db, "teams", teamId, "users", userId);

    await deleteDoc(userRef);

    await removePfp(getPfpName(teamId, userId));

    console.log(" Remove User has completed");
  } catch (e) {
    console.log("Remove User failed: ", e);
    throw e; // Rethrow the error to handle it at the caller's level if needed
  }
}

module.exports = { removeUser };
