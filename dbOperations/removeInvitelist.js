import { deleteDoc, doc } from "firebase/firestore";
import { db } from "~/firebaseConfig";

async function removeInvitelist(teamId, inviteId) {
  try {
    await deleteDoc(doc(db, "teams", teamId, "invitelist", inviteId));
  } catch (e) {
    console.log("Remove Invite failed: ", e);
    throw e; // Rethrow the error to handle it at the caller's level if needed
  }
}

module.exports = { removeInvitelist };
