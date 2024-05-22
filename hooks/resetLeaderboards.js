import { collection, getDocs, query, runTransaction } from "firebase/firestore";

import { db } from "~/firebaseConfig";

//A function to clear the "best_attemepts" collection
async function resetLeaderboards() {
  await runTransaction(db, async (transaction) => {
    try {
      let bestAttemptQuery = query(
        collection(db, "teams", "1", "best_attempts"),
      );
      const bestAttemptSnapshot = await getDocs(bestAttemptQuery);

      for (const doc of bestAttemptSnapshot.docs) {
        let docData = doc.data();

        console.log("best_attempt doc: ", doc.ref);

        //TODO: set documents to null
        // await transaction.update(doc.ref, null) //not sure if this works yet
      }
    } catch (e) {
      console.error("Error getting or updating best_attempts:", e);
    }
  });
}

module.exports = { resetLeaderboards };
