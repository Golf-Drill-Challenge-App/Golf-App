import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { FlatList, View } from "react-native";
import {
  ActivityIndicator,
  Appbar,
  Divider,
  Menu,
  SegmentedButtons,
  Text,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "~/Constants";
import { getErrorString } from "~/Utility";
import AssignmentsList from "~/components/assignmentList";
import DialogComponent from "~/components/dialog";
import DrillList from "~/components/drillList";
import EmptyScreen from "~/components/emptyScreen";
import ErrorComponent from "~/components/errorComponent";
import Header from "~/components/header";
import Loading from "~/components/loading";
import ProfileCard from "~/components/profileCard";
import RefreshInvalidate from "~/components/refreshInvalidate";
import { useAlertContext } from "~/context/Alert";
import { useAuthContext } from "~/context/Auth";
import { useDrillInfo } from "~/dbOperations/hooks/useDrillInfo";
import { useEmailInfo } from "~/dbOperations/hooks/useEmailInfo";
import { useUserInfo } from "~/dbOperations/hooks/useUserInfo";
import { invalidateMultipleKeys } from "~/dbOperations/invalidateMultipleKeys";
import { removeUser } from "~/dbOperations/removeUser";
import { db } from "~/firebaseConfig";

//A function to add a user to the blacklist table with a timestamp
async function blacklistUser(teamId, userId, userInfo, userEmail) {
  //Create new document with userId as the id and a time field

  try {
    await setDoc(doc(db, "teams", teamId, "blacklist", userId), {
      time: Date.now(),
      name: userInfo["name"],
      email: userEmail,
    });
    //remove users data
    await removeUser(teamId, userId);
    console.log("User Removed successfully!");
  } catch (e) {
    console.log("Error removing user:", e);
    throw e; // Rethrow the error to handle it at the caller's level if needed
  }
}

async function changeRole(teamId, userId, newRole) {
  const userRef = doc(db, "teams", teamId, "users", userId);
  try {
    await updateDoc(userRef, { role: newRole });
    console.log("User Role Changed successfully!");
  } catch (e) {
    console.log("Error changing user role:", e);
    throw e; // Rethrow the error to handle it at the caller's level if needed
  }
}

function Index() {
  const userId = useLocalSearchParams()["user"];
  const navigation = useNavigation();

  const queryClient = useQueryClient();

  const [menuVisible, setMenuVisible] = useState(false);

  const [removeDialogVisible, setRemoveDialogVisible] = useState(false);
  const hideRemoveDialog = () => setRemoveDialogVisible(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  const [banDialogVisible, setBanDialogVisible] = useState(false);
  const hideBanDialog = () => setBanDialogVisible(false);
  const [banLoading, setBanLoading] = useState(false);

  const [promoteLoading, setPromoteLoading] = useState(false);

  const { showDialog, showSnackBar } = useAlertContext();

  const { currentUserId, currentTeamId } = useAuthContext();

  const {
    data: userInfo,
    error: userError,
    isLoading: userIsLoading,
  } = useUserInfo({ userId });

  const {
    data: currentUserInfo,
    error: currentUserError,
    isLoading: currentUserIsLoading,
  } = useUserInfo({ userId: currentUserId });

  const {
    data: userEmail,
    error: userEmailError,
    isLoading: userEmailIsLoading,
  } = useEmailInfo({ userId });

  const {
    data: drillInfo,
    error: drillInfoError,
    isLoading: drillInfoIsLoading,
  } = useDrillInfo();

  const [value, setValue] = useState("drills");

  const invalidateKeys = [
    ["userInfo", { userId }],
    ["userInfo", { userId: currentUserId }],
    ["emailInfo", { userId }],
    ["drillInfo"],
  ];

  if (
    userIsLoading ||
    userEmailIsLoading ||
    drillInfoIsLoading ||
    currentUserIsLoading
  ) {
    return <Loading />;
  }

  if (userError || userEmailError || drillInfoError || currentUserError) {
    return (
      <ErrorComponent
        errorList={[
          userError,
          userEmailError,
          drillInfoError,
          currentUserError,
        ]}
      />
    );
  }
  const profileHeader = () => (
    <View
      style={{
        alignItems: "center",
        marginBottom: 20,
      }}
    >
      <ProfileCard user={userInfo} email={userEmail} />
    </View>
  );

  const uniqueDrills = userInfo["uniqueDrills"].map(
    (drillId) => drillInfo[drillId],
  );
  const segmentButtons = () => {
    return (
      <>
        {currentUserInfo["role"] !== "player" && (
          <SegmentedButtons
            value={value}
            onValueChange={setValue}
            style={{
              marginLeft: 10,
              marginRight: 10,
              backgroundColor: themeColors.highlight,
              borderRadius: 20,
              position: "sticky",
            }}
            theme={{
              colors: {
                secondaryContainer: themeColors.overlay,
              },
            }}
            buttons={[
              {
                value: "drills",
                label: "Drills",
              },
              {
                value: "assignments",
                label: "Assignments",
              },
            ]}
          />
        )}
      </>
    );
  };

  const DrillScreen = () => (
    <>
      {uniqueDrills.length > 0 ? (
        <DrillList
          drillData={uniqueDrills}
          href={"/content/team/users/" + userInfo.uid + "/drills/"}
          userId={userInfo.uid}
        ></DrillList>
      ) : (
        <EmptyScreen text={"No drills attempted yet."} />
      )}
    </>
  );

  const AssignmentScreen = () => (
    <AssignmentsList
      role={currentUserInfo["role"]}
      singleUser={true}
      playerInfo={[userInfo]}
      drillInfo={drillInfo}
      disableCriteria={({ completed, hasStats }) => !completed || !hasStats}
    />
  );

  const tabComponent = {
    drills: <DrillScreen />,
    assignments: <AssignmentScreen />,
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["right", "top", "left"]}>
      <Header
        title={userInfo["name"] + "'s Profile"}
        preChildren={
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack();
            }}
            color={themeColors.accent}
          />
        }
        postChildren={
          currentUserInfo.role === "owner" && userInfo.role !== "owner" ? (
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
                  userInfo.role === "player"
                    ? "account-arrow-up-outline"
                    : "account-arrow-down-outline"
                }
                onPress={async () => {
                  try {
                    setPromoteLoading(true);
                    await changeRole(
                      currentTeamId,
                      userId,
                      userInfo.role === "player" ? "coach" : "player",
                    );
                    await invalidateMultipleKeys(queryClient, [["userInfo"]]); //invalidate cache
                    showSnackBar("User role changed successfully!");
                    setMenuVisible(false);
                  } catch (e) {
                    console.log(e);
                    showDialog("Error", getErrorString(e));
                  }
                  setPromoteLoading(false);
                }}
                title={
                  <>
                    {promoteLoading ? (
                      <ActivityIndicator color={"#1C1B1F"} />
                    ) : (
                      <Text>
                        {userInfo.role === "player" ? "Promote" : "Demote"}
                      </Text>
                    )}
                  </>
                }
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
      {userInfo.role === "player" ? (
        <FlatList
          refreshControl={<RefreshInvalidate invalidateKeys={invalidateKeys} />}
          stickyHeaderIndices={[1]}
          data={[
            profileHeader(),
            segmentButtons(),
            <View>{tabComponent[value]}</View>,
          ]}
          renderItem={({ item }) => item}
        />
      ) : (
        <FlatList
          data={[profileHeader()]}
          renderItem={({ item }) => item}
          refreshControl={<RefreshInvalidate invalidateKeys={invalidateKeys} />}
        />
      )}
      {/* Remove user dialog */}
      <DialogComponent
        title={"Alert"}
        content="All data will be lost when this user is removed."
        visible={removeDialogVisible}
        onHide={hideRemoveDialog}
        buttons={[
          {
            children: "Cancel",
            pressHandler: hideRemoveDialog,
          },
          {
            children: "Remove User",
            pressHandler: async () => {
              setRemoveLoading(true);
              try {
                await removeUser(currentTeamId, userId);
                await queryClient.removeQueries(["userInfo", userId]);
                await invalidateMultipleKeys(queryClient, [
                  ["userInfo"],
                  ["best_attempts"],
                ]);
                navigation.goBack();
              } catch (e) {
                console.log("Error removing user:", e);
                hideRemoveDialog();
                showDialog("Error", getErrorString(e));
                setRemoveLoading(false);
              }
            },
            loading: removeLoading,
          },
        ]}
      />
      {/* Ban user dialog */}
      <DialogComponent
        title={"Alert"}
        content="Banning this user will delete all their data and prevent them from joining the team again."
        visible={banDialogVisible}
        onHide={hideBanDialog}
        buttons={[
          { children: "Cancel", pressHandler: hideBanDialog },
          {
            children: "Ban User",
            pressHandler: async () => {
              setBanLoading(true);
              try {
                await blacklistUser(currentTeamId, userId, userInfo, userEmail);
                await queryClient.removeQueries(["userInfo", userId]);
                await invalidateMultipleKeys(queryClient, [
                  ["userInfo"],
                  ["best_attempts"],
                ]); //invalidate cache
                navigation.goBack();
              } catch (e) {
                console.log("Error banning user:", e);
                hideBanDialog();
                showDialog("Error", getErrorString(e));
                setBanLoading(false);
              }
            },
            loading: banLoading,
          },
        ]}
      />
    </SafeAreaView>
  );
}

export default Index;
