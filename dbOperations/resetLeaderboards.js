import { collection, getDocs, query, runTransaction } from "firebase/firestore";

import { db } from "~/firebaseConfig";

//A function to clear the "best_attemepts" collection
async function resetLeaderboards(teamId) {
  try {
    await runTransaction(db, async (transaction) => {
      const bestAttemptQuery = query(
        collection(db, "teams", teamId, "best_attempts"),
      );
      const bestAttemptSnapshot = await getDocs(bestAttemptQuery);

      for (const doc of bestAttemptSnapshot.docs) {
        const docData = doc.data();
        const keys = Object.keys(docData);

        //An empty doc with all player id's set to null
        const emptyDoc = {};

        keys.forEach((key) => {
          emptyDoc[key] = null;
        });

        await transaction.update(doc.ref, emptyDoc); //not sure if this works yet
      }
    });

    console.log("Leaderboards have been reset");
  } catch (e) {
    console.log("Error getting or updating best_attempts: ", e);
    throw e; // Rethrow the error to handle it at the caller's level if needed
  }
}

module.exports = { resetLeaderboards };
