import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { signOut as signoutFireBase } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import EmptyScreen from "~/components/emptyScreen";
import { currentAuthContext } from "~/context/Auth";
import { auth, db } from "~/firebaseConfig";
import { invalidateMultipleKeys } from "~/hooks/invalidateMultipleKeys";

function ChooseTeam() {
  const { signOut, currentUserId, currentUserInfo, setCurrentUserId } =
    currentAuthContext();
  const queryClient = useQueryClient();
  async function handleSignOut() {
    try {
      await signoutFireBase(auth);
      signOut();
    } catch (e) {
      alert(e);
      console.log(e);
    }
  }
  return (
    <EmptyScreen
      text={"Choose a team"}
      postChild={() => (
        <>
          <View
            style={{
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              onPress={async () => {
                await setDoc(doc(db, "teams", "1", "users", currentUserId), {
                  name: currentUserInfo["displayName"],
                  // hardcoded pfp string for now, add pfp upload to profile settings in future PR
                  pfp: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  // hardcoded "player" role for now, add role selection to profile settings in future PR
                  role: "player",
                  uid: currentUserId,
                  assigned_data: [],
                });
                setCurrentUserId(currentUserId);
                invalidateMultipleKeys(queryClient, [
                  ["userInfo", { userId: currentUserId }],
                ]);
                router.replace("/");
              }}
              style={{
                backgroundColor: "lightblue",
                padding: 50,
              }}
            >
              <Text>Join Team</Text>
            </Button>
          </View>
          <View
            style={{
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              onPress={handleSignOut}
              style={{
                backgroundColor: "lightblue",
              }}
            >
              <Text>Sign Out</Text>
            </Button>
          </View>
        </>
      )}
    />
  );
}

export default ChooseTeam;
