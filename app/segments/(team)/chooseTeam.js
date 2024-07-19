import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { signOut as signoutFireBase } from "firebase/auth";
import { useMemo } from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "~/Constants";
import { getErrorString } from "~/Utility";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import { useAlertContext } from "~/context/Alert";
import { useAuthContext } from "~/context/Auth";
import { addToTeam } from "~/dbOperations/addToTeam";
import { addToWaitlist } from "~/dbOperations/addToWaitlist";
import { useBlackList } from "~/dbOperations/hooks/useBlackList";
import { useWaitlist } from "~/dbOperations/hooks/useWaitlist";
import { invalidateMultipleKeys } from "~/dbOperations/invalidateMultipleKeys";
import { auth } from "~/firebaseConfig";

function ChooseTeam() {
  const {
    signOut,
    currentUserId,
    currentUserInfo,
    setCurrentUserId,
    currentTeamId,
  } = useAuthContext();
  const queryClient = useQueryClient();

  const { showDialog } = useAlertContext();

  const {
    data: blacklist,
    error: blacklistError,
    isLoading: blacklistIsLoading,
  } = useBlackList();

  const {
    data: waitlist,
    error: waitlistError,
    isLoading: waitlistIsLoading,
  } = useWaitlist();

  const state = useMemo(() => {
    if (blacklist && blacklist[currentUserId]) {
      return "blacklist";
    }
    if (waitlist && waitlist[currentUserId]) {
      return "waitlist";
    }
    return "neutral";
  }, [blacklist, currentUserId, waitlist]); //blacklist, waitlist, invited, neutral

  if (blacklistIsLoading || waitlistIsLoading) {
    return <Loading />;
  }

  if (blacklistError || waitlistError) {
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
        {state === "blacklist" ? (
          <Text
            style={{
              fontSize: 16,
              textAlign: "center",
              color: "gray",
            }}
          >
            You've been banned from this team.
          </Text>
        ) : state === "waitlist" ? (
          <Text
            style={{
              fontSize: 16,
              textAlign: "center",
              color: "gray",
            }}
          >
            Your request to join the team has been received
          </Text>
        ) : state === "invited" ? (
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
                await addToTeam(currentTeamId, currentUserId, currentUserInfo);
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
                await addToWaitlist(
                  currentTeamId,
                  currentUserId,
                  currentUserInfo,
                );
                await invalidateMultipleKeys(queryClient, [["waitlist"]]);
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
                Request to Join Team
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
