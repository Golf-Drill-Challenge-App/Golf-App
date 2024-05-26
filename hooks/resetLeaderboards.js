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
        let keys = Object.keys(docData);

        //An empty doc with all player id's set to null
        let emptyDoc = {};

        keys.forEach((key) => {
          emptyDoc[key] = null;
        });

        await transaction.update(doc.ref, emptyDoc); //not sure if this works yet
      }
    } catch (e) {
      console.error("Error getting or updating best_attempts:", e);
    }
  });

  console.log("Leaderboards have been reset");
}

module.exports = { resetLeaderboards };
