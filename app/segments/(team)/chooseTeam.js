import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import {
  onIdTokenChanged,
  sendEmailVerification,
} from "firebase/auth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { signOut as signoutFireBase } from "firebase/auth";
import { useMemo } from "react";
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
import { useInvitelist } from "~/dbOperations/hooks/useInviteList";
import { useUserInfo } from "~/dbOperations/hooks/useUserInfo";
import { useWaitlist } from "~/dbOperations/hooks/useWaitlist";
import { invalidateMultipleKeys } from "~/dbOperations/invalidateMultipleKeys";
import { removeInvitelist } from "~/dbOperations/removeInvitelist";
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

  const { showDialog, showSnackBar } = useAlertContext();

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

  const [verified, setVerified] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const invalidateKeys = [
    ["invitelist"],
    ["blacklist"],
    ["waitlist"],
    ["userInfo", { userId: currentUserId }],
  ];

  async function handleSignOut() {
    try {
      await signoutFireBase(auth);
      signOut();
    } catch (e) {
      console.log(e);
      showDialog("Error", getErrorString(e));
    }
  }

  useEffect(() => {
    const unregisterAuthObserver = onIdTokenChanged(auth, async (user) => {
      if (user) {
        if (user.emailVerified) {
          setVerified(true);
          showSnackBar("Email successfully verified.");
          clearInterval(intervalId); // Stop the interval when email is verified
          unregisterAuthObserver(); // Unregister the auth observer
        } else {
          setVerified(false);
          console.log("Error: Email Not Verified Yet, Try Again");
        }
      }
    });

    // Set up an interval to check email verification every 10 seconds
    const intervalId = setInterval(async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload();
      }
    }, 10000); // 10,000 ms = 10 seconds

    return () => {
      clearInterval(intervalId); // Clean up the interval when component unmounts
      unregisterAuthObserver(); // Unregister the auth observer
    };
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await auth.currentUser.reload();
    await invalidateMultipleKeys(queryClient, invalidateKeys);
    setRefreshing(false);
  }, []);

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {!verified ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text>Waiting for email verification...</Text>
            <Button
              style={{
                backgroundColor: themeColors.accent,
                borderRadius: 12,
                marginTop: 20,
              }}
              onPress={async () => {
                setLoading(true);
                try {
                  await sendEmailVerification(auth.currentUser);
                  console.log("Verification Email Sent!");
                  showSnackBar("Verification Email Sent!");
                } catch (e) {
                  console.log("Error sending verification email: ", e);
                  showDialog("Error", getErrorString(e));
                }
                setLoading(false);
              }}
              loading={loading}
              textColor="white"
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
          </View>
        ) : state === "blacklist" ? (
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
                //temporary, should be replaced with multiple team functionality
                await addToTeam(currentTeamId, currentUserId, currentUserInfo);
                await removeInvitelist(currentTeamId, invitelist["id"]);
                setCurrentUserId(currentUserId);
                await invalidateMultipleKeys(queryClient, invalidateKeys);
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
                await invalidateMultipleKeys(queryClient, invalidateKeys);
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
