import { useLocalSearchParams, useNavigation } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, Divider, Menu } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "~/Constants";
import DrillList from "~/components/drillList";
import EmptyScreen from "~/components/emptyScreen";
import ErrorComponent from "~/components/errorComponent";
import Header from "~/components/header";
import Loading from "~/components/loading";
import PaperWrapper from "~/components/paperWrapper";
import ProfileCard from "~/components/profileCard";
import { currentAuthContext } from "~/context/Auth";
import { db } from "~/firebaseConfig";
import { useDrillInfo } from "~/hooks/useDrillInfo";
import { useEmailInfo } from "~/hooks/useEmailInfo";
import { useUserInfo } from "~/hooks/useUserInfo";

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

  const [menuVisible, setMenuVisible] = useState(false);

  const { currentUserId } = currentAuthContext();

  const {
    data: currentUserData,
    userError: currentUserError,
    userIsLoading: currentUserIsLoading,
  } = useUserInfo(currentUserId);

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
    drillInfoError ||
    attemptsError
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
                      console.log("pressed menu button");
                      setMenuVisible(true);
                    }}
                    color={themeColors.accent}
                  />
                }
                anchorPosition="bottom"
                contentStyle={{ backgroundColor: themeColors.background }}
              >
                {userData.role === "player" ? (
                  <Menu.Item
                    leadingIcon="account-arrow-up-outline"
                    onPress={() => {
                      changeRole(userId, "coach");
                      setMenuVisible(false);
                    }}
                    title="Promote"
                  />
                ) : (
                  <Menu.Item
                    leadingIcon="account-arrow-down-outline"
                    onPress={() => {
                      changeRole(userId, "player");
                      setMenuVisible(false);
                    }}
                    title="Demote"
                  />
                )}
                <Divider />
                <Menu.Item
                  leadingIcon="account-cancel-outline"
                  onPress={() => {}}
                  title="Remove"
                />
                <Divider />
                <Menu.Item onPress={() => {}} title="Item 3" />
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
            preChild={() => {
              profileHeader;
            }}
          />
        )}
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
