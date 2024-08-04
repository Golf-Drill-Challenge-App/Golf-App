import {
  collection,
  deleteField,
  doc,
  getDocs,
  query,
  runTransaction,
  where,
} from "firebase/firestore";
import { getPfpName } from "~/Utility";
import { db } from "~/firebaseConfig";
import removePfp from "./removePfp";

async function removeUser(teamId, userId) {
  try {
    await runTransaction(db, async (transaction) => {
      //Remove all attempts from attempts table with UID == userID
      const attemptQuery = query(
        collection(db, "teams", teamId, "attempts"),
        where("uid", "==", userId),
      );

      const attemptSnapshot = await getDocs(attemptQuery);

      for (const doc of attemptSnapshot.docs) {
        await transaction.delete(doc.ref);
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
          await transaction.update(doc.ref, {
            [userId]: deleteField(),
          });
        }
      }

      //Remove user from user table where UID == userID
      const userRef = doc(db, "teams", teamId, "users", userId);

      const userSnapshot = await transaction.get(userRef);

      //remove pfp if there is one
      if (userSnapshot.data().pfp !== "") {
        await removePfp(getPfpName(teamId, userId));
      }

      await transaction.delete(userRef);

      console.log(" Remove User Transaction has completed");
    });
  } catch (e) {
    console.log("Remove User Transaction failed: ", e);
    throw e; // Rethrow the error to handle it at the caller's level if needed
  }
}

module.exports = { removeUser };
