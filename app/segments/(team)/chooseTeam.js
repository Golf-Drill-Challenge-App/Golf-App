import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { sendEmailVerification } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "~/Constants";
import { getErrorString } from "~/Utility";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import { useAlertContext } from "~/context/Alert";
import { useAuthContext } from "~/context/Auth";
import { invalidateMultipleKeys } from "~/dbOperations/invalidateMultipleKeys";
import { auth, db } from "~/firebaseConfig";

function ChooseTeam() {
  // const auth = getAuth();
  const { signOut, currentUserId, currentUserInfo, setCurrentUserId } =
    useAuthContext();
  const queryClient = useQueryClient();

  const { showDialog } = useAlertContext();

  const [blacklist, setBlacklist] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function handleSignOut() {
    try {
      await signoutFireBase(auth);
      signOut();
    } catch (e) {
      console.log(e);
      showDialog("Error", getErrorString(e));
    }
  }

  // TODO: make an actual hook for this? Shouldn't be related tho, as is coach pov?
  useEffect(() => {
    const fetchBlacklistDoc = async () => {
      try {
        const docRef = doc(db, "teams", "1", "blacklist", currentUserId);
        const docSnap = await getDoc(docRef);

        //See if the user is on blacklist
        setBlacklist(docSnap.exists());
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) {
      fetchBlacklistDoc();
    }
  }, [currentUserId]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorComponent errorList={[error]} />;
  }

  return (
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
                // Email verification sent!
                //temporary, should be replaced with multiple team functionality
                await setDoc(doc(db, "teams", "1", "users", currentUserId), {
                  name: currentUserInfo["displayName"],
                  // hardcoded pfp string for now, add pfp upload to profile settings in future PR
                  pfp: "",
                  // hardcoded "player" role for now, add role selection to profile settings in future PR
                  role: "player",
                  uid: currentUserId,
                  assigned_data: [],
                  uniqueDrills: [],
                });
                setCurrentUserId(currentUserId);
                await invalidateMultipleKeys(queryClient, [
                  ["userInfo", { userId: currentUserId }],
                ]);
                sendEmailVerification(auth.currentUser)
                  .then(() => {
                    // Email verification sent!
                    console.error("VERIFICATION SENT");
                    console.error(
                      "PLEASE VERIFY EMAIL WITHIN THE NEXT 30 SECONDS.",
                    );
                    setTimeout(() => {
                      // TODO: Do more research on currentUser.reload()
                      // References on currentUser.reload():
                      // https://stackoverflow.com/questions/53508364/update-the-email-verification-status-without-reloading-page
                      // https://stackoverflow.com/questions/50271839/firebase-observe-email-verification-status-in-real-time/50272808#50272808
                      auth.currentUser.reload();
                      console.log(auth.currentUser.emailVerified);
                    }, "30000");
                    if (auth.currentUser.emailVerified) {
                      console.error(
                        "EMAIL VERIFIED, REDIRECTING TO HOMESCREEN",
                      );
                      router.replace("/");
                    }
                  })
                  .catch((err) => {
                    console.error("VERIFICATION FAILED");
                    console.error(err);
                  });
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
                textAlign: "center",
              }}
            >
              Sign Out
            </Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default ChooseTeam;
