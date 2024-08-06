import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { signOut as signoutFireBase } from "firebase/auth";
import { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "~/Constants";
import { getErrorString } from "~/Utility";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import RefreshInvalidate from "~/components/refreshInvalidate";
import { useAlertContext } from "~/context/Alert";
import { useAuthContext } from "~/context/Auth";
import { addToTeam } from "~/dbOperations/addToTeam";
import { addToWaitlist } from "~/dbOperations/addToWaitlist";
import { useBlackList } from "~/dbOperations/hooks/useBlackList";
import { useInvitelist } from "~/dbOperations/hooks/useInviteList";
import { useUserInfo } from "~/dbOperations/hooks/useUserInfo";
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

  const [buttonLoading, setButtonLoading] = useState(false);
  const [signoutLoading, setSignoutLoading] = useState(false);

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

  const {
    data: invitelist,
    error: invitelistError,
    isLoading: invitelistIsLoading,
  } = useInvitelist({ email: currentUserInfo.email });

  //basically to trigger the side effect that navigates off this page
  useUserInfo({ userId: currentUserId });

  const state = useMemo(() => {
    if (blacklist && blacklist[currentUserId]) {
      return "blacklist";
    }
    if (waitlist && waitlist[currentUserId]) {
      return "waitlist";
    }
    if (invitelist && invitelist["id"] !== undefined) {
      return "invitelist";
    }
    return "neutral";
  }, [blacklist, currentUserId, invitelist, waitlist]); //blacklist, waitlist, invitelist, neutral

  const invalidateKeys = [
    ["invitelist"],
    ["blacklist"],
    ["waitlist"],
    ["userInfo", { userId: currentUserId }],
  ];

  if (blacklistIsLoading || waitlistIsLoading || invitelistIsLoading) {
    return <Loading />;
  }

  if (blacklistError || waitlistError || invitelistError) {
    return (
      <ErrorComponent
        errorList={[blacklistError, waitlistError, invitelistError]}
      />
    );
  }

  async function handleSignOut() {
    setSignoutLoading(true);
    try {
      await signoutFireBase(auth);
      signOut();
    } catch (e) {
      console.log(e);
      showDialog("Error", getErrorString(e));
    }
    setSignoutLoading(false);
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
        ) : state === "invitelist" ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                textAlign: "center",
                color: "gray",
              }}
            >
              You have been invited to the team
            </Text>
            <Button
              onPress={async () => {
                setButtonLoading(true);
                //temporary, should be replaced with multiple team functionality
                await addToTeam(currentTeamId, currentUserId, currentUserInfo);
                setCurrentUserId(currentUserId);
                await invalidateMultipleKeys(queryClient, invalidateKeys);
                setButtonLoading(false);
                router.replace("/");
              }}
              style={{
                backgroundColor: themeColors.accent,
                borderRadius: 12,
                marginTop: 20,
              }}
            >
              {buttonLoading ? (
                <ActivityIndicator color={themeColors.accent} />
              ) : (
                <Text
                  style={{
                    color: themeColors.highlight,
                    fontSize: 18,
                    textAlign: "center",
                  }}
                >
                  Join Team
                </Text>
              )}
            </Button>
          </View>
        ) : (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              onPress={async () => {
                setButtonLoading(true);
                await addToWaitlist(
                  currentTeamId,
                  currentUserId,
                  currentUserInfo,
                );
                await invalidateMultipleKeys(queryClient, invalidateKeys);
                setButtonLoading(false);
              }}
              style={{
                backgroundColor: themeColors.accent,
                borderRadius: 12,
                marginTop: 20,
              }}
            >
              {buttonLoading ? (
                <ActivityIndicator color={themeColors.accent} />
              ) : (
                <Text
                  style={{
                    color: themeColors.highlight,
                    fontSize: 18,
                    textAlign: "center",
                  }}
                >
                  Request to Join Team
                </Text>
              )}
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
            {signoutLoading ? (
              <ActivityIndicator color={themeColors.accent} />
            ) : (
              <Text
                style={{
                  color: themeColors.highlight,
                  fontSize: 18,
                  textAlign: "center",
                }}
              >
                Sign Out
              </Text>
            )}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ChooseTeam;
