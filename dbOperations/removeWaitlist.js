import { deleteDoc, doc } from "firebase/firestore";
import { db } from "~/firebaseConfig";

async function removeWaitlist(teamId, userId) {
  try {
    await deleteDoc(doc(db, "teams", teamId, "waitlist", userId));
  } catch (e) {
    console.log("Remove Blacklist Transaction failed: ", e);
    throw e; // Rethrow the error to handle it at the caller's level if needed
  }
}

module.exports = { removeWaitlist };
