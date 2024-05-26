import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { signOut as signoutFireBase } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Button, PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "~/Constants";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import { currentAuthContext } from "~/context/Auth";
import { auth, db } from "~/firebaseConfig";
import { invalidateMultipleKeys } from "~/hooks/invalidateMultipleKeys";

function ChooseTeam() {
  const { signOut, currentUserId, currentUserInfo, setCurrentUserId } =
    currentAuthContext();
  const queryClient = useQueryClient();

  const [blacklist, setBlacklist] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function handleSignOut() {
    try {
      await signoutFireBase(auth);
      signOut();
    } catch (e) {
      alert(e);
      console.log(e);
    }
  }

  useEffect(() => {
    const fetchBlacklistDoc = async () => {
      try {
        const docRef = doc(db, "teams", "1", "blacklist", currentUserId);
        const docSnap = await getDoc(docRef);

        //See if the user is on blacklist
        setBlacklist(docSnap.exists());
      } catch (err) {
        console.error("Error fetching document: ", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlacklistDoc();
  }, [currentUserId]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorComponent errorList={[error]} />;
  }

  return (
    <PaperProvider>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {blacklist ? (
            <Text
              style={{
                fontSize: 16,
                textAlign: "center",
                color: "gray",
              }}
            >
              You've been banned from this team.
            </Text>
          ) : (
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
                    uniqueDrills: [],
                  });
                  setCurrentUserId(currentUserId);
                  invalidateMultipleKeys(queryClient, [
                    ["userInfo", { userId: currentUserId }],
                  ]);
                  router.replace("/");
                }}
                style={{
                  backgroundColor: themeColors.accent,
                  borderRadius: 12,
                  marginTop: 20,
                }}
              >
                <Text
                  style={{
                    color: themeColors.highlight,
                    fontSize: 18,
                    fontSize: 18,
                    textAlign: "center",
                  }}
                >
                  Join Team
                </Text>
              </Button>
            </View>
          )}
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
                backgroundColor: themeColors.accent,
                borderRadius: 12,
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  color: themeColors.highlight,
                  fontSize: 18,
                  fontSize: 18,
                  textAlign: "center",
                }}
              >
                Sign Out
              </Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}

export default ChooseTeam;
