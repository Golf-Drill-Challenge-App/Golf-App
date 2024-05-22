import {
  collection,
  deleteField,
  doc,
  getDocs,
  query,
  runTransaction,
  where,
} from "firebase/firestore";
import { db } from "~/firebaseConfig";

async function removeUser(userId) {
  try {
    runTransaction(db, async (transaction) => {
      //Remove all attempts from attempts table with UID == userID
      let attemptQuery = query(
        collection(db, "teams", "1", "attempts"),
        where("uid", "==", userId),
      );

      const attemptSnapshot = await getDocs(attemptQuery);

      for (const doc of attemptSnapshot.docs) {
        transaction.delete(doc.ref);
      }

      //Remove all entries from best_attempts table with UID == userID
      let bestAttemptQuery = query(
        collection(db, "teams", "1", "best_attempts"),
      );

      const bestAttemptSnapshot = await getDocs(bestAttemptQuery);

      for (const doc of bestAttemptSnapshot.docs) {
        let docData = doc.data();

        if (docData[userId]) {
          //Delete the field
          transaction.update(doc.ref, {
            [userId]: deleteField(),
          });
        }
      }

      //Remove user from user table where UID == userID
      const userRef = doc(db, "teams", "1", "users", userId);

      transaction.delete(userRef);

      console.log(" Remove User Transaction has completed");
    });
  } catch (e) {
    console.error("Remove User Transaction failed: ", error);
  }
}

module.exports = { removeUser };
