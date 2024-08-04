import { doc, setDoc } from "firebase/firestore";
import { db } from "~/firebaseConfig";

export async function addToWaitlist(
  currentTeamId,
  currentUserId,
  currentUserInfo,
) {
  try {
    const newRequestRef = doc(
      db,
      "teams",
      currentTeamId,
      "waitlist",
      currentUserId,
    );
    const currentTime = Date.now();
    await setDoc(newRequestRef, {
      displayName: currentUserInfo["displayName"],
      email: currentUserInfo["email"],
      time: currentTime,
    });
  } catch (e) {
    console.log("Add to Waitlist failed: ", e);
    throw e; // Rethrow the error to handle it at the caller's level if needed
  }
}
