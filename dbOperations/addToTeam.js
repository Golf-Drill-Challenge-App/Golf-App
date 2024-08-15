import { doc, setDoc } from "firebase/firestore";
import { db } from "~/firebaseConfig";

//temporary, should be replaced with multiple team functionality
export async function addToTeam(currentTeamId, currentUserId, currentUserInfo) {
  console.log("currentUserInfo", currentUserInfo);
  try {
    await setDoc(doc(db, "teams", currentTeamId, "users", currentUserId), {
      name: currentUserInfo["displayName"],
      // hardcoded pfp string for now, add pfp upload to profile settings in future PR
      pfp: "",
      // hardcoded "player" role for now, add role selection to profile settings in future PR
      role: "player",
      uid: currentUserId,
      assigned_data: [],
      uniqueDrills: [],
    });
  } catch (e) {
    console.log("Add to Team failed: ", e);
    throw e; // Rethrow the error to handle it at the caller's level if needed
  }
}
