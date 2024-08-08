import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "~/firebaseConfig";

export async function addToInvitelist(currentTeamId, email) {
  try {
    const newRequestRef = doc(
      collection(db, "teams", currentTeamId, "invitelist"),
    );
    await setDoc(newRequestRef, { email });
  } catch (e) {
    console.log("Add to Waitlist failed: ", e);
    throw e; // Rethrow the error to handle it at the caller's level if needed
  }
}
