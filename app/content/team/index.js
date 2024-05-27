import { MaterialIcons } from "@expo/vector-icons";
import {
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  ActivityIndicator,
  Appbar,
  Icon,
  List,
  Menu,
  Searchbar,
  Text,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "~/Constants";
import { getErrorString } from "~/Utility";
import ProfilePicture from "~/components/ProfilePicture";
import BottomSheetWrapper from "~/components/bottomSheetWrapper";
import DialogComponent from "~/components/dialog";
import ErrorComponent from "~/components/errorComponent";
import Header from "~/components/header";
import Loading from "~/components/loading";
import PaperWrapper from "~/components/paperWrapper";
import RefreshInvalidate from "~/components/refreshInvalidate";
import { currentAuthContext } from "~/context/Auth";
import { db } from "~/firebaseConfig";
import { handleImageUpload } from "~/hooks/imageUpload";
import { invalidateMultipleKeys } from "~/hooks/invalidateMultipleKeys";
import { resetLeaderboards } from "~/hooks/resetLeaderboards";
import { useTeamInfo } from "~/hooks/useTeamInfo";
import { useUserInfo } from "~/hooks/useUserInfo";

function Index() {
  const { currentUserId, currentTeamId } = currentAuthContext();

  const {
    data: userInfo,
    isLoading: userInfoIsLoading,
    error: userInfoError,
  } = useUserInfo();

  //Used for Displaying coach/owner view
  const {
    data: currentUserInfo,
    error: currentUserError,
    isLoading: currentUserIsLoading,
  } = useUserInfo({ userId: currentUserId });

  const {
    data: currentTeamData,
    error: currentTeamError,
    isLoading: currentTeamIsLoading,
  } = useTeamInfo({ teamId: currentTeamId });

  const invalidateKeys = [
    ["teamInfo", { teamId: currentTeamId }],
    ["userInfo"],
  ];
  const [searchQuery, setSearchQuery] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);

  const [snackbarVisible, setSnackbarVisible] = useState(false); // State to toggle snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(""); // State to set snackbar message
  const [imageUploading, setImageUploading] = useState(false);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");

  const showDialog = (title, message) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogVisible(true);
  };

  const onChangeSearch = (query) => setSearchQuery(query);

  const [resetDialogVisible, setResetDialogVisible] = useState(false);
  const hideResetDialog = () => setResetDialogVisible(false);

  const [newName, setNewName] = useState("");

  const bottomSheetModalRef = useRef(null);
  const queryClient = useQueryClient();

  const teamRef = doc(db, "teams", currentTeamId);

  useEffect(() => {
    setNewName(currentTeamData ? currentTeamData.name : "");
  }, [currentTeamData]);

  const resetForm = () => {
    setNewName(currentTeamData.name);
  };

  if (userInfoIsLoading || currentUserIsLoading || currentTeamIsLoading)
    return <Loading />;

  if (userInfoError || currentUserError || currentTeamError)
    return (
      <ErrorComponent
        errorList={[userInfoError, currentUserError, currentTeamError]}
      />
    );
  const foundUsers = Object.values(userInfo)
    .filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((user1, user2) => {
      // Assign priorities based on conditions
      const getPriority = (user) => {
        if (user["uid"] === currentUserId) {
          return 0; // Highest priority
        } else if (user.role === "owner") {
          return 1;
        } else if (user.role === "player") {
          return 2;
        } else if (user.role === "coach") {
          return 3;
        } else {
          return 4; // Fallback
        }
      };

      const priority1 = getPriority(user1);
      const priority2 = getPriority(user2);

      // First, compare by priority
      if (priority1 !== priority2) {
        return priority1 - priority2;
      }

      // If priorities are the same, then sort alphabetically by name
      return user1.name.localeCompare(user2.name);
    });

  const handleUpdate = async () => {
    if (newName && newName !== currentTeamData.name) {
      // check if they request to update their name to a new one
      await updateDoc(doc(db, "teams", currentTeamId), {
        name: newName,
      });
      invalidateMultipleKeys(queryClient, [["teamInfo"]]);
      bottomSheetModalRef.current.close();
      setSnackbarMessage("Name field updated successfully");
      setSnackbarVisible(true); // Show success snackbar
    }
  };

  const roleColor = (user) =>
    user["uid"] === currentUserId
      ? themeColors.accent
      : user.role === "owner"
        ? "#3366ff"
        : "#222";

  const styles = StyleSheet.create({
    modalContent: {
      paddingHorizontal: 30, // Increase padding for more spacing
      paddingBottom: 60,
      alignItems: "center",
    },
    profilePicture: {
      width: 175,
      height: 100,
      marginBottom: 10,
    },
    penIconContainer: {
      position: "absolute",
      top: 5,
      right: 5,
      width: 30,
      height: 30,
      borderRadius: 15, // half of the width and height to make it a circle
      borderWidth: 1, // add border
      borderColor: "black", // border color
      backgroundColor: themeColors.highlight,
      justifyContent: "center",
      alignItems: "center",
    },
    input: {
      borderBottomWidth: 1,
      borderColor: "gray",
      marginBottom: 20, // Increase margin bottom for more spacing
      width: "80%",
      padding: 10, // Increase padding for input fields
    },
    saveChangesButton: {
      backgroundColor: themeColors.accent,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      marginBottom: 20,
      width: 100, // Increase the width of the button
      alignSelf: "center",
    },
    saveChangesButtonText: {
      color: "#FFF",
      fontWeight: "bold",
      alignSelf: "center",
    },
    activityIndicator: {
      alignSelf: "center",
      width: "100%",
      height: "100%",
      borderRadius: 60,
    },
  });

  return (
    <PaperWrapper>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          {/* Generic Error dialog */}
          <DialogComponent
            title={dialogTitle}
            content={dialogMessage}
            visible={dialogVisible}
            onHide={() => setDialogVisible(false)}
          />
          {/* Snackbar Error Dialog */}
          <DialogComponent
            type={"snackbar"}
            visible={snackbarVisible}
            content={snackbarMessage}
            onHide={() => setSnackbarVisible(false)}
          />
          <DialogComponent
            title={"Alert"}
            content="Resetting the season will wipe all leaderboards"
            visible={resetDialogVisible}
            onHide={hideResetDialog}
            buttons={["Cancel", "Reset Season"]}
            buttonsFunctions={[
              hideResetDialog,
              async () => {
                try {
                  await resetLeaderboards();
                  invalidateMultipleKeys(queryClient, [["best_attempts"]]);
                  hideResetDialog();
                } catch (e) {
                  console.log("Error resetting season:", e);
                  showDialog("Error", getErrorString(e));
                }
              },
            ]}
          />
          <SafeAreaView
            // flex: without this the scrollview automatically scrolls back up when finger no longer held down
            style={{ flex: 1 }}
            forceInset={{ top: "always" }}
            // edges: to remove bottom padding above tabbar. Maybe move this (and PaperProvider) into app/_layout.js?
            edges={["right", "top", "left"]}
          >
            <TouchableWithoutFeedback
              // dismiss keyboard after tapping outside of search bar input
              onPress={Keyboard.dismiss}
              accessible={false}
            >
              <>
                <Header
                  title={"Team"}
                  postChildren={
                    currentUserInfo.role === "owner" ? (
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
                        contentStyle={{
                          backgroundColor: themeColors.background,
                        }}
                      >
                        <Menu.Item
                          leadingIcon="pencil-outline"
                          onPress={() => {
                            bottomSheetModalRef.current?.present();
                            setMenuVisible(false);
                          }}
                          title="Edit Team"
                        />
                        <Menu.Item
                          leadingIcon="restart"
                          onPress={() => {
                            console.log("Reset Season Pressed!");
                            setMenuVisible(false);
                            setResetDialogVisible(true);
                          }}
                          title="Reset Season"
                        />
                      </Menu>
                    ) : (
                      <></>
                    )
                  }
                />
                <BottomSheetWrapper
                  ref={bottomSheetModalRef}
                  closeFn={() => {
                    resetForm();
                  }}
                >
                  <BottomSheetScrollView
                    contentContainerStyle={styles.modalContent}
                    keyboardDismissMode="interactive"
                    keyboardShouldPersistTaps="handled"
                  >
                    {/* Team Picture */}
                    <TouchableOpacity
                      onPress={async () => {
                        await handleImageUpload(
                          setImageUploading,
                          setSnackbarMessage,
                          currentTeamId,
                          teamRef,
                        );
                        invalidateMultipleKeys(queryClient, [["teamInfo"]]);
                      }}
                    >
                      <View>
                        {imageUploading ? (
                          <ActivityIndicator
                            animating={imageUploading}
                            size="large"
                            color={themeColors.accent}
                            style={styles.activityIndicator}
                          />
                        ) : (
                          <ProfilePicture
                            userInfo={currentTeamData}
                            style={[styles.profilePicture]}
                          />
                        )}

                        <View style={styles.penIconContainer}>
                          <MaterialIcons name="edit" size={24} color="black" />
                        </View>
                      </View>
                    </TouchableOpacity>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "baseline",
                      }}
                    >
                      <Text
                        style={{
                          marginTop: 0,
                          fontSize: 30,
                          marginRight: 0,
                          textAlign: "center",
                        }}
                      >
                        {currentTeamData.name}
                      </Text>
                    </View>
                    <View
                      style={{ width: "80%", marginBottom: 10, marginTop: 20 }}
                    >
                      <Text style={{ fontSize: 16 }}>Update the team name</Text>
                    </View>

                    {/* Name Update input field */}
                    <BottomSheetTextInput
                      style={styles.input}
                      value={newName}
                      onChangeText={(text) => setNewName(text)}
                      placeholder="Update team name"
                    />

                    {/* Save Button */}
                    <TouchableOpacity
                      style={styles.saveChangesButton}
                      onPress={handleUpdate}
                    >
                      <Text style={styles.saveChangesButtonText}>Update</Text>
                    </TouchableOpacity>
                  </BottomSheetScrollView>
                </BottomSheetWrapper>
                <KeyboardAwareScrollView
                  // allows opening links from search results without closing keyboard first
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  stickyHeaderIndices={[3]}
                  refreshControl={
                    <RefreshInvalidate invalidateKeys={invalidateKeys} />
                  }
                >
                  <View style={{ alignItems: "center" }}>
                    <ProfilePicture
                      userInfo={currentTeamData}
                      style={styles.profilePicture}
                    />
                  </View>
                  <View style={{ alignItems: "center" }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "baseline",
                      }}
                    >
                      <Text
                        style={{
                          marginTop: 0,
                          fontSize: 30,
                          marginRight: 0,
                          textAlign: "center",
                        }}
                      >
                        {currentTeamData.name}
                      </Text>
                    </View>
                  </View>

                  <Text style={{ textAlign: "center", marginBottom: 20 }}>
                    {Object.keys(userInfo).length} members
                  </Text>
                  <View
                    style={{
                      backgroundColor: themeColors.background,
                      paddingBottom: 10,
                      paddingTop: 10,
                    }}
                  >
                    <Searchbar
                      onChangeText={onChangeSearch}
                      value={searchQuery}
                      style={{
                        marginLeft: 20,
                        marginRight: 20,
                        backgroundColor: themeColors.highlight,
                        borderWidth: 1,
                        borderColor: themeColors.border,
                      }}
                      placeholder="Search team members"
                      selectionColor={themeColors.accent}
                      cursorColor={themeColors.accent}
                    />
                  </View>

                  <List.Section
                    style={{ backgroundColor: themeColors.background }}
                  >
                    {foundUsers.map((user) => {
                      const userId = user["uid"];
                      return (
                        <List.Item
                          key={userId}
                          title={user.name}
                          style={{
                            paddingLeft: 20,
                          }}
                          left={() => (
                            <ProfilePicture
                              userInfo={user}
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: 12,
                              }}
                            />
                          )}
                          right={() => (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Text
                                style={{
                                  color: roleColor(user),
                                }}
                              >
                                {userId === currentUserId ? "Me!" : user.role}
                              </Text>
                              <Icon source="chevron-right" />
                            </View>
                          )}
                          onPress={() =>
                            router.push(`content/team/users/${userId}`)
                          }
                        />
                      );
                    })}
                  </List.Section>
                </KeyboardAwareScrollView>
              </>
            </TouchableWithoutFeedback>
          </SafeAreaView>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </PaperWrapper>
  );
}

export default Index;
