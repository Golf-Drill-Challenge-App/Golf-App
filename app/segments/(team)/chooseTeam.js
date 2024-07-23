import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import {
  onIdTokenChanged,
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

  const { showDialog, showSnackBar } = useAlertContext();

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
                let completed = false;

                const unregisterAuthObserver = onIdTokenChanged(
                  auth,
                  async (user) => {
                    if (user && !completed) {
                      await user.reload();
                      if (user.emailVerified) {
                        completed = true;
                        console.log(
                          "Email successfully verified. Adding user to team, then redirecting to Home Screen",
                        );
                        showSnackBar(
                          "Email successfully verified. Adding user to team, then redirecting to Home Screen",
                        );

                        // Update Firestore document
                        await setDoc(
                          doc(db, "teams", "1", "users", currentUserId),
                          {
                            name: currentUserInfo["displayName"],
                            pfp: "",
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
                        unregisterAuthObserver();
                        // Navigate to the next page
                        router.replace("/");
                      } else {
                        console.log("Error: Email Not Verified Yet, Try Again");
                        showDialog(
                          "Error",
                          "Email Not Verified Yet, Try Again",
                        );
                        // Allow re-attempt
                        completed = false;
                      }
                    }
                  },
                );

                // Trigger a user reload to update the token and invoke the listener
                await auth.currentUser.reload();
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
                  console.log("Verification Email Sent!");
                  showSnackBar("Verification Email Sent!");
                })
                .catch((e) => {
                  console.log("Error sending verification email: ", e);
                  showDialog("Error", getErrorString(e));
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
