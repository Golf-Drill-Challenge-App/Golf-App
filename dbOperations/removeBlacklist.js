import { deleteDoc, doc } from "firebase/firestore";
import { db } from "~/firebaseConfig";

async function removeBlacklist(teamId, userId) {
  try {
    await deleteDoc(doc(db, "teams", teamId, "blacklist", userId));
  } catch (e) {
    console.log("Remove User from Blacklist failed: ", e);
    throw e; // Rethrow the error to handle it at the caller's level if needed
  }
}

module.exports = { removeBlacklist };
