import { doc, runTransaction } from "firebase/firestore";
import { db } from "~/firebaseConfig";

async function removeBlacklist(teamId, userId) {
  try {
    await runTransaction(db, async (transaction) => {
      //Remove user from user table where UID == userID
      const userRef = doc(db, "teams", teamId, "blacklist", userId);

      await transaction.delete(userRef);
    });
  } catch (e) {
    console.log("Remove Blacklist Transaction failed: ", e);
    throw e; // Rethrow the error to handle it at the caller's level if needed
  }
}

module.exports = { removeBlacklist };
