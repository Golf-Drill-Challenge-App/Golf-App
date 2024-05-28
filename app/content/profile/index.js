import { MaterialIcons } from "@expo/vector-icons";
import {
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { useQueryClient } from "@tanstack/react-query";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as signoutFireBase,
  updatePassword,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ActivityIndicator, Appbar, Switch } from "react-native-paper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { themeColors } from "~/Constants";
import { getErrorString } from "~/Utility";
import ProfilePicture from "~/components/ProfilePicture";
import BottomSheetWrapper from "~/components/bottomSheetWrapper";
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
import { handleImageUpload } from "~/hooks/imageUpload";
import { invalidateMultipleKeys } from "~/hooks/invalidateMultipleKeys";
import { useDrillInfo } from "~/hooks/useDrillInfo";
import { useEmailInfo } from "~/hooks/useEmailInfo";
import { useUserInfo } from "~/hooks/useUserInfo";

function Index() {
  const { signOut, currentUserId, currentTeamId } = currentAuthContext();
  const userId = currentUserId ?? null;
  const auth = getAuth();

  const insets = useSafeAreaInsets();

  const { height, width } = useWindowDimensions();

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
    data: drillInfo,
    error: drillInfoError,
    isLoading: drillInfoIsLoading,
  } = useDrillInfo();

  // ref
  const bottomSheetModalRef = useRef(null);
  const queryClient = useQueryClient(); // also called here for updating name

  // variables
  const invalidateKeys = [
    ["userInfo", { userId }],
    ["best_attempts", { userId }],
    ["userEmail", { userId }],
    ["drillInfo"],
  ];
  const [newName, setNewName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordCheck, setNewPasswordCheck] = useState("");
  const [passwordInputVisible, setPasswordInputVisible] = useState(false);

  const [snackbarVisible, setSnackbarVisible] = useState(false); // State to toggle snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(""); // State to set snackbar message

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  const profilePicSize = 120;

  useEffect(() => {
    setNewName(userData ? userData.name : "");
    setEmail(userEmail);
  }, [userData, userEmail]);

  if (userIsLoading || userEmailIsLoading || drillInfoIsLoading) {
    return <Loading />;
  }

  if (userError || userEmailError || drillInfoError) {
    return (
      <ErrorComponent errorList={[userError, userEmailError, drillInfoError]} />
    );
  }

  const userRef = doc(db, "teams", currentTeamId, "users", userId);

  const uniqueDrills = userData["uniqueDrills"].map(
    (drillId) => drillInfo[drillId],
  );

  async function handleSignOut() {
    try {
      await signoutFireBase(auth);
      signOut();
    } catch (e) {
      console.log(e);
      showDialog("Error", getErrorString(e));
    }
  }

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setNewPasswordCheck("");
  };

  const showDialog = (title, message) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogVisible(true);
  };

  const showSnackBar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleUpdate = async () => {
    if (!newName) {
      showDialog("Input Needed", "Please enter a new name.");
      return;
    }
    if (!passwordInputVisible && newName === userData.name) {
      showDialog(
        "No Change Detected",
        "The new name must be different from the current name.",
      );
      return;
    }
    if (passwordInputVisible && !(currentPassword && newPassword)) {
      showDialog("Incomplete Form", "Please fill out all the password fields.");
      return;
    }
    if (newPassword !== newPasswordCheck) {
      showDialog(
        "Passwords Do Not Match",
        "The new passwords you entered do not match. Please try again.",
      );
      return;
    }
    try {
      if (passwordInputVisible) {
        // attempt updating the password
        // re-authenticate the user and check if the provided current password is valid
        const userCredential = await signInWithEmailAndPassword(
          auth,
          userEmail,
          currentPassword,
        );

        // once re-authenticated, update the password
        await updatePassword(userCredential.user, newPassword);

        // Update successful
        resetForm();
        bottomSheetModalRef.current.close();
        setPasswordInputVisible(false);
        showSnackBar("Password updated successfully");
      }
      //doing password first because it checks if the user's entered password is correct, so the form is submitted at once
      if (newName !== userData.name) {
        // check if they request to update their name to a new one
        await updateDoc(doc(db, "teams", currentTeamId, "users", userId), {
          name: newName,
        });

        // invalidate cache on successful name update
        invalidateMultipleKeys(queryClient, [["userInfo"]]);
        bottomSheetModalRef.current.close();
        showSnackBar("Name field updated successfully");
      }
    } catch (e) {
      console.log(e);
      showDialog("Error", getErrorString(e));
    }
  };

  const styles = StyleSheet.create({
    profileContainer: {
      alignItems: "center",
      marginBottom: 20,
    },
    modalContent: {
      paddingHorizontal: 30, // Increase padding for more spacing
      paddingBottom:
        insets.bottom + insets.top + Platform.OS === "android" ? 60 : 110,
      alignItems: "center",
    },
    profilePictureContainer: {
      position: "relative",
      width: profilePicSize,
      height: profilePicSize,
      borderRadius: profilePicSize / 2,
      marginBottom: 20,
    },
    profilePicture: {
      width: profilePicSize,
      height: profilePicSize,
      borderRadius: 60,
    },
    penIconContainer: {
      position: "absolute",
      top: 0,
      right: 0,
      width: 30,
      height: 30,
      borderRadius: 15, // half of the width and height to make it a circle
      borderWidth: 1, // add border
      borderColor: "black", // border color
      backgroundColor: themeColors.highlight,
      justifyContent: "center",
      alignItems: "center",
    },
    emailContainer: {
      alignItems: "center",
      marginBottom: 15,
    },
    emailText: {
      color: "gray",
      fontSize: 14, // Adjust as needed
    },
    input: {
      borderBottomWidth: 1,
      borderColor: "gray",
      marginBottom: 20, // Increase margin bottom for more spacing
      width: "80%",
      paddingVertical: 10, // Increase padding for input fields
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
    changePasswordButton: {
      color: "black",
      fontSize: 16,
    },
    signOutButton: {
      color: themeColors.accent,
      fontSize: 16,
    },
    activityIndicator: {
      alignSelf: "center",
      width: "100%",
      height: "100%",
      borderRadius: 60,
    },
  });
  const profileHeader = (
    <>
      <View style={styles.profileContainer}>
        <ProfileCard user={userData} email={userEmail} />
      </View>
    </>
  );

  return (
    <PaperWrapper>
      <View style={{ height: height, width: width }}>
        <GestureHandlerRootView>
          <BottomSheetModalProvider>
            {/* Snackbar Error Dialog */}
            <DialogComponent
              type={"snackbar"}
              visible={snackbarVisible}
              content={snackbarMessage}
              onHide={() => setSnackbarVisible(false)}
            />

            {/* Generic Error dialog */}
            <DialogComponent
              title={dialogTitle}
              content={dialogMessage}
              visible={dialogVisible}
              onHide={() => setDialogVisible(false)}
            />
            <SafeAreaView style={{ flex: 1 }} edges={["right", "top", "left"]}>
              <Header
                title={"Personal Profile"}
                postChildren={
                  <Appbar.Action
                    icon="cog"
                    color={themeColors.accent}
                    onPress={() => bottomSheetModalRef.current?.present()}
                    style={{ marginRight: 7 }}
                  />
                }
              />
              <BottomSheetWrapper
                ref={bottomSheetModalRef}
                closeFn={() => {
                  resetForm();
                  setNewName(userData.name);
                  setPasswordInputVisible(false);
                }}
              >
                <BottomSheetScrollView
                  contentContainerStyle={styles.modalContent}
                  keyboardDismissMode="interactive"
                  keyboardShouldPersistTaps="handled"
                >
                  {/* Profile Picture */}
                  <TouchableOpacity
                    onPress={async () => {
                      await handleImageUpload(
                        setImageUploading,
                        setSnackbarMessage,
                        userId,
                        userRef,
                      );
                      invalidateMultipleKeys(queryClient, [["userInfo"]]);
                    }}
                  >
                    <View style={styles.profilePictureContainer}>
                      {imageUploading ? (
                        <ActivityIndicator
                          animating={imageUploading}
                          size="large"
                          color={themeColors.accent}
                          style={styles.activityIndicator}
                        />
                      ) : (
                        <ProfilePicture
                          userInfo={userData}
                          style={styles.profilePicture}
                        />
                      )}
                      <View style={styles.penIconContainer}>
                        <MaterialIcons name="edit" size={24} color="black" />
                      </View>
                    </View>
                  </TouchableOpacity>
                  {/* Display Name */}
                  <Text
                    style={{
                      fontSize: 20,
                      marginBottom: 10,
                      fontWeight: "bold",
                    }}
                  >
                    {userData.name}
                  </Text>

                  {/* Display Email */}
                  <View style={styles.emailContainer}>
                    <Text style={styles.emailText}>{email}</Text>
                  </View>

                  {/* Name Update input field */}
                  <View style={{ width: "80%", marginBottom: 10 }}>
                    <Text style={styles.changePasswordButton}>
                      Update your name
                    </Text>
                  </View>
                  <BottomSheetTextInput
                    style={styles.input}
                    value={newName}
                    onChangeText={(text) => setNewName(text)}
                    placeholder="Update your name"
                  />

                  {/* Change Password Button */}
                  <View
                    style={{
                      marginBottom: 20, // Increase margin bottom for more spacing
                      flexDirection: "row",
                      alignItems: "center",
                      width: "80%",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.changePasswordButton}>
                      Change Password
                    </Text>
                    <Switch
                      value={passwordInputVisible}
                      onValueChange={(newValue) => {
                        resetForm();
                        setPasswordInputVisible(newValue);
                      }}
                      theme={{
                        colors: {
                          primary: themeColors.accent,
                        },
                      }}
                    />
                  </View>

                  {/* Password Input Field */}
                  {passwordInputVisible && (
                    <>
                      <BottomSheetTextInput
                        style={styles.input}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        placeholder="Enter your current password"
                        secureTextEntry={true}
                        // to get rid of ios password suggestions
                        // More info on onChangeText + ios password suggestions bug: https://github.com/facebook/react-native/issues/21261
                        // Workaround ("oneTimeCode" textContentType): https://stackoverflow.com/a/68658035
                        textContentType="oneTimeCode"
                      />
                      <BottomSheetTextInput
                        style={styles.input}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="Enter your new password"
                        secureTextEntry={true}
                        textContentType="newPassword"
                      />
                      <BottomSheetTextInput
                        style={styles.input}
                        value={newPasswordCheck}
                        onChangeText={setNewPasswordCheck}
                        placeholder="Confirm your new password"
                        secureTextEntry={true}
                        textContentType="newPassword"
                      />
                    </>
                  )}

                  {/* Save Button */}
                  <TouchableOpacity
                    style={styles.saveChangesButton}
                    onPress={handleUpdate}
                  >
                    <Text style={styles.saveChangesButtonText}>Update</Text>
                  </TouchableOpacity>

                  {/* Sign Out Button */}
                  <Pressable onPress={handleSignOut}>
                    <Text style={styles.signOutButton}>Sign Out</Text>
                  </Pressable>
                </BottomSheetScrollView>
              </BottomSheetWrapper>
              {uniqueDrills.length > 0 ? (
                <View
                  style={{
                    paddingBottom: Platform.OS === "ios" ? 86 + 50 : 86,
                  }}
                >
                  <DrillList
                    drillData={uniqueDrills}
                    href={"content/profile/drills/"}
                    userId={userId}
                    invalidateKeys={invalidateKeys}
                  >
                    {profileHeader}
                  </DrillList>
                </View>
              ) : (
                <>
                  <EmptyScreen
                    invalidateKeys={invalidateKeys}
                    text={"No drills attempted yet"}
                    preChild={() => profileHeader}
                  />
                </>
              )}
            </SafeAreaView>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </View>
    </PaperWrapper>
  );
}

export default Index;
