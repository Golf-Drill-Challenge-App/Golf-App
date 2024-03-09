import { signOut as signoutFireBase } from "firebase/auth";
import { Pressable } from "react-native";
import { PaperProvider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { currentAuthContext } from "~/context/Auth";
import { auth } from "~/firebaseConfig";

//This is for the list of drills
export default function Index() {
  const { signOut } = currentAuthContext();
  async function handleSignOut() {
    signoutFireBase(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((e) => {
        alert(e);
        console.log(e);
      });
    signOut();
  }
  return (
    <PaperProvider>
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Plan Index</Text>
        <Pressable onPress={handleSignOut}>
          <Text
            style={{
              textAlign: "center",
              marginTop: 20,
              fontSize: 20,
              color: "#F24E1E",
            }}
          >
            {" "}
            Sign Out{" "}
          </Text>
        </Pressable>
      </SafeAreaView>
    </PaperProvider>
  );
}
