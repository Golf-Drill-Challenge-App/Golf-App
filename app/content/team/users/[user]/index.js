import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, Divider, Menu } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "~/Constants";
import DialogComponent from "~/components/dialog";
import DrillList from "~/components/drillList";
import EmptyScreen from "~/components/emptyScreen";
import ErrorComponent from "~/components/errorComponent";
import Header from "~/components/header";
import Loading from "~/components/loading";
import PaperWrapper from "~/components/paperWrapper";
import ProfileCard from "~/components/profileCard";
import { currentAuthContext } from "~/context/Auth";
import { db } from "~/firebaseConfig";
import { invalidateMultipleKeys } from "~/hooks/invalidateMultipleKeys";
import { removeUser } from "~/hooks/removeUser";
import { useBestAttempts } from "~/hooks/useBestAttempts";
import { useDrillInfo } from "~/hooks/useDrillInfo";
import { useEmailInfo } from "~/hooks/useEmailInfo";
import { useUserInfo } from "~/hooks/useUserInfo";

//A function to add a user to the blacklist table with a timestamp
async function blacklistUser(userId, userData) {
  //Create new document with userId as the id and a time field
  await setDoc(doc(db, "teams", "1", "blacklist", userId), {
    time: Date.now(),
    name: userData["name"],
  });

  //remove users data
  await removeUser(userId);
}

async function changeRole(userId, newRole) {
  const userRef = doc(db, "teams", "1", "users", userId);

  try {
    await updateDoc(userRef, { role: newRole });
    console.log("Document updated successfully!");
  } catch (error) {
    console.error("Error updating document:", error);
  }
}

function Index() {
  const userId = useLocalSearchParams()["user"];
  const navigation = useNavigation();

  const queryClient = useQueryClient();

  const [menuVisible, setMenuVisible] = useState(false);

  const [removeDialogVisible, setRemoveDialogVisible] = useState(false);
  const hideRemoveDialog = () => setRemoveDialogVisible(false);

  const [banDialogVisible, setBanDialogVisible] = useState(false);
  const hideBanDialog = () => setBanDialogVisible(false);

  const { currentUserId } = currentAuthContext();

  //Used for Displaying coach/owner view
  const {
    data: currentUserData,
    error: currentUserError,
    isLoading: currentUserIsLoading,
  } = useUserInfo({ userId: currentUserId });

  const {
    data: userData,
    error: userError,
    isLoading: userIsLoading,
  } = useUserInfo({ userId });

  const {
    data: userEmail,
    error: userEmailError,
    isLoading: userEmailIsLoading,
  } = useEmailInfo({ userId });

  const {
    data: userLeaderboard,
    error: userLeaderboardError,
    isLoading: userLeaderboardIsLoading,
  } = useBestAttempts({ userId });

  const {
    data: drillInfo,
    error: drillInfoError,
    isLoading: drillInfoIsLoading,
  } = useDrillInfo();

  if (
    userIsLoading ||
    currentUserIsLoading ||
    userEmailIsLoading ||
    userLeaderboardIsLoading ||
    drillInfoIsLoading
  ) {
    return <Loading />;
  }

  if (
    userError ||
    currentUserError ||
    userEmailError ||
    userLeaderboardError ||
    drillInfoError
  ) {
    return (
      <ErrorComponent
        errorList={[
          userError,
          userEmailError,
          userLeaderboardError,
          drillInfoError,
        ]}
      />
    );
  }
  const profileHeader = () => (
    <View style={styles.profileContainer}>
      <ProfileCard user={userData} email={userEmail} />
    </View>
  );

  const invalidateKeys = [
    ["best_attempts", { userId }],
    ["userInfo", { userId }],
    ["emailInfo", { userId }],
    ["drillInfo"],
  ];

  const uniqueDrills = Object.keys(userLeaderboard).map(
    (drillId) => drillInfo[drillId],
  );

  return (
    <PaperWrapper>
      <SafeAreaView style={{ flex: 1 }} edges={["right", "top", "left"]}>
        <Header
          title={userData["name"] + "'s Profile"}
          preChildren={
            <Appbar.BackAction
              onPress={() => {
                navigation.goBack();
              }}
              color={themeColors.accent}
            />
          }
          postChildren={
            currentUserData.role === "owner" && userData.role != "owner" ? (
              <Menu
                visible={menuVisible}
                onDismiss={() => {
                  setMenuVisible(false);
                }}
                anchor={
                  <Appbar.Action
                    icon="dots-horizontal-circle-outline"
                    onPress={() => {
                      setMenuVisible(true);
                    }}
                    color={themeColors.accent}
                  />
                }
                statusBarHeight={45}
                anchorPosition="bottom"
                contentStyle={{ backgroundColor: themeColors.background }}
              >
                <Menu.Item
                  leadingIcon={
                    userData.role === "player"
                      ? "account-arrow-up-outline"
                      : "account-arrow-down-outline"
                  }
                  onPress={() => {
                    userData.role === "player"
                      ? changeRole(userId, "coach")
                      : changeRole(userId, "player");
                    queryClient.invalidateQueries(["userInfo", { userId }]); //invalidate cache
                    setMenuVisible(false);
                  }}
                  title={userData.role === "player" ? "Promote" : "Demote"}
                />
                <Divider />
                <Menu.Item
                  leadingIcon="account-cancel-outline"
                  onPress={() => {
                    setMenuVisible(false);
                    setRemoveDialogVisible(true);
                  }}
                  title="Remove"
                />
                <Divider />
                <Menu.Item
                  leadingIcon="account-lock-outline"
                  onPress={() => {
                    setMenuVisible(false);
                    setBanDialogVisible(true);
                  }}
                  title="Ban"
                />
              </Menu>
            ) : (
              <></>
            )
          }
        />

        {uniqueDrills.length > 0 ? (
          <DrillList
            drillData={uniqueDrills}
            href={"/content/team/users/" + userData.uid + "/drills/"}
            userId={userData.uid}
            invalidateKeys={invalidateKeys}
          >
            {profileHeader}
          </DrillList>
        ) : (
          <EmptyScreen
            invalidateKeys={invalidateKeys}
            text={"No drills attempted yet."}
            preChild={profileHeader}
          />
        )}
        {/* Remove user dialog */}
        <DialogComponent
          title={"Alert"}
          content="All data will be lost when this user is removed."
          visible={removeDialogVisible}
          onHide={hideRemoveDialog}
          buttons={["Cancel", "Remove User"]}
          buttonsFunctions={[
            hideRemoveDialog,
            async () => {
              try {
                await removeUser(userId);
                await queryClient.removeQueries(["userInfo", userId]);
                invalidateMultipleKeys(queryClient, [
                  ["userInfo"],
                  ["best_attempts"],
                ]);
                navigation.goBack();
              } catch {
                console.error("Error removing user:", e);
              }
            },
          ]}
        />
        {/* Ban user dialog */}
        <DialogComponent
          title={"Alert"}
          content="Banning this user will delete all their data and prevent them from joining the team again."
          visible={banDialogVisible}
          onHide={hideBanDialog}
          buttons={["Cancel", "Ban User"]}
          buttonsFunctions={[
            hideBanDialog,
            async () => {
              await blacklistUser(userId, userData);
              invalidateMultipleKeys(queryClient, ["user"]); //invalidate cache
              navigation.goBack();
            },
          ]}
        />
      </SafeAreaView>
    </PaperWrapper>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  heading: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  noDrillsText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    color: "gray",
  },
});

export default Index;
