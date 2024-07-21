import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { signOut as signoutFireBase } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ScrollView, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "~/Constants";
import { getErrorString } from "~/Utility";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import RefreshInvalidate from "~/components/refreshInvalidate";
import { useAlertContext } from "~/context/Alert";
import { useAuthContext } from "~/context/Auth";
import { useBlackList } from "~/dbOperations/hooks/useBlackList";
import { invalidateMultipleKeys } from "~/dbOperations/invalidateMultipleKeys";
import { auth, db } from "~/firebaseConfig";

function ChooseTeam() {
  const { signOut, currentUserId, currentUserInfo, setCurrentUserId } =
    useAuthContext();
  const queryClient = useQueryClient();

  const { showDialog } = useAlertContext();

  const {
    data: blacklist,
    error: blacklistError,
    isLoading: blacklistIsLoading,
  } = useBlackList();

  const invalidateKeys = [["blacklist"]];

  if (blacklistIsLoading) {
    return <Loading />;
  }

  if (blacklistError) {
    return <ErrorComponent errorList={[blacklistError]} />;
  }

  async function handleSignOut() {
    try {
      await signoutFireBase(auth);
      signOut();
    } catch (e) {
      console.log(e);
      showDialog("Error", getErrorString(e));
    }
  }

  return (
    <SafeAreaView
      style={{
        justifyContent: "center",
        flex: 1,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 1,
        }}
        refreshControl={<RefreshInvalidate invalidateKeys={invalidateKeys} />}
      >
        {blacklist[currentUserId] ? (
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
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              onPress={async () => {
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
      </ScrollView>
    </SafeAreaView>
  );
}

export default ChooseTeam;
