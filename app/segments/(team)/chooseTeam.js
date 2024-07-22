import { useQueryClient } from "@tanstack/react-query";
import {
  sendEmailVerification,
  signOut as signoutFireBase,
} from "firebase/auth";
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
                //temporary, should be replaced with multiple team functionality
                // TODO: Maybe instead of setTimeout, use onIdTokenChanged (https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#onidtokenchanged)
                auth.currentUser.reload();
                setTimeout(async () => {
                  console.error("Delayed for 5 second.");
                  if (auth.currentUser.emailVerified) {
                    await setDoc(
                      doc(db, "teams", "1", "users", currentUserId),
                      {
                        name: currentUserInfo["displayName"],
                        // hardcoded pfp string for now, add pfp upload to profile settings in future PR
                        pfp: "",
                        // hardcoded "player" role for now, add role selection to profile settings in future PR
                        role: "player",
                        uid: currentUserId,
                        assigned_data: [],
                        uniqueDrills: [],
                      },
                    );
                    setCurrentUserId(currentUserId);
                    await invalidateMultipleKeys(queryClient, [
                      ["userInfo", { userId: currentUserId }],
                    ]);
                  } else {
                    console.error("EMAIL NOT VERIFIED YET, TRY AGAIN");
                  }
                }, "5000");
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
            style={{
              backgroundColor: themeColors.accent,
              borderRadius: 12,
              marginTop: 20,
            }}
            onPress={async () => {
              // TODO: Add this (sendEmailVerification) to signup as well
              sendEmailVerification(auth.currentUser)
                .then(() => {
                  // Email verification sent!
                  console.error("VERIFICATION SENT");
                })
                .catch((err) => {
                  console.error("VERIFICATION FAILED");
                  console.error(err);
                });
            }}
          >
            <Text
              style={{
                color: themeColors.highlight,
                fontSize: 18,
                textAlign: "center",
              }}
            >
              Resend Verification Email
            </Text>
          </Button>
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
