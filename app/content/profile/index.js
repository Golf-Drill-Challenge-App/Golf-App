import { MaterialIcons } from "@expo/vector-icons";
import { KeyboardAvoiderScrollView } from "@good-react-native/keyboard-avoider";
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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Appbar,
  Button,
  Dialog,
  Portal,
  Switch,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { debounce } from "underscore";
import { themeColors } from "~/Constants";
import { getErrorString, getPfpName } from "~/Utility";
import ProfilePicture from "~/components/ProfilePicture";
import BottomSheetWrapper from "~/components/bottomSheetWrapper";
import DrillList from "~/components/drillList";
import EmptyScreen from "~/components/emptyScreen";
import ErrorComponent from "~/components/errorComponent";
import Header from "~/components/header";
import Loading from "~/components/loading";
import ProfileCard from "~/components/profileCard";
import { useAlertContext } from "~/context/Alert";
import { useAuthContext } from "~/context/Auth";
import { useDrillInfo } from "~/dbOperations/hooks/useDrillInfo";
import { useEmailInfo } from "~/dbOperations/hooks/useEmailInfo";
import { useUserInfo } from "~/dbOperations/hooks/useUserInfo";
import { handleImageUpload } from "~/dbOperations/imageUpload";
import { invalidateMultipleKeys } from "~/dbOperations/invalidateMultipleKeys";
import removePfp from "~/dbOperations/removePfp";
import { db } from "~/firebaseConfig";

function Index() {
  const { signOut, currentUserId, currentTeamId } = useAuthContext();
  const userId = currentUserId ?? null;
  const auth = getAuth();

  const { showDialog, showSnackBar } = useAlertContext();

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
  const [listFlag, setListFlag] = useState(false);
  const [newName, setNewName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordCheck, setNewPasswordCheck] = useState("");
  const [passwordInputVisible, setPasswordInputVisible] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const hideUploadModal = () => setModalVisible(false);

  const [imageUploading, setImageUploading] = useState(false);

  const [updateLoading, setUpdateLoading] = useState(false);

  const profilePicSize = 120;

  const data = useMemo(
    () =>
      Array(5)
        .fill(0)
        .map((_, index) => `index-${index}`),
    [],
  );

  useEffect(() => {
    setNewName(userData ? userData.name : "");
    setEmail(userEmail);
  }, [userData, userEmail]);

  const handleUpdate = useCallback(
    debounce(
      async () => {
        setUpdateLoading(true);
        if (!newName) {
          showDialog("Input Needed", "Please enter a new name.");
          setUpdateLoading(false);
          return;
        }
        if (!passwordInputVisible && newName === userData.name) {
          showDialog(
            "No Change Detected",
            "The new name must be different from the current name.",
          );
          setUpdateLoading(false);
          return;
        }
        if (passwordInputVisible && !(currentPassword && newPassword)) {
          showDialog(
            "Incomplete Form",
            "Please fill out all the password fields.",
          );
          setUpdateLoading(false);
          return;
        }
        if (newPassword !== newPasswordCheck) {
          showDialog(
            "Passwords Do Not Match",
            "The new passwords you entered do not match. Please try again.",
          );
          setUpdateLoading(false);
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
            await invalidateMultipleKeys(queryClient, [["userInfo"]]);
            bottomSheetModalRef.current.close();
            showSnackBar("Name field updated successfully");
          }
        } catch (e) {
          console.log(e);
          showDialog("Error", getErrorString(e));
        }
        setUpdateLoading(false);
      },
      1000,
      true,
    ),
    [
      currentPassword,
      newName,
      newPassword,
      newPasswordCheck,
      passwordInputVisible,
      userData,
      userEmail,
    ],
  );

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
      if (e.code === "auth/wrong-password") {
        showDialog("Error", "Invalid password");
      } else {
        showDialog("Error", getErrorString(e));
      }
    }
  }

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setNewPasswordCheck("");
  };

  const styles = StyleSheet.create({
    profileContainer: {
      alignItems: "center",
      marginBottom: 20,
    },
    modalContent: {
      paddingHorizontal: 30, // Increase padding for more spacing
      paddingBottom: 30,
      alignItems: "center",
    },
    profilePictureContainer: {
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
      width: 100,
      marginBottom: 20,
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
    button: {
      flex: 1, // Each button takes up equal width
      borderRadius: 12,
      marginTop: 20,
    },
    uploadButtonText: {
      fontSize: 16,
    },
    removeButtonText: {
      fontSize: 16,
      color: userData.pfp ? themeColors.accent : "#808080",
      textAlign: "center",
    },
    editModal: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      marginBottom: 30,
    },
    editButtons: {
      // paddingVertical: 10,
      marginBottom: 10,
    },
    editModalTitleText: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
    },
    editModalContentText: {
      marginBottom: 20,
    },
  });
  const profileHeader = (
    <View style={styles.profileContainer}>
      <ProfileCard user={userData} email={userEmail} />
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text>{item}</Text>
    </View>
  );

  return (
    <BottomSheetModalProvider>
      <Portal>
        <Dialog
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          style={{ backgroundColor: "white" }}
        >
          <Dialog.Title style={{ fontWeight: "bold" }}>
            Edit Profile Picture
          </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              {`Remove the current Profile Picture or ${userData.pfp ? "Change to" : "Upload"} a new Profile Picture`}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              style={styles.button}
              onPress={async () => {
                setRemoveLoading(true);
                try {
                  await updateDoc(userRef, {
                    pfp: "",
                  });
                  await removePfp(getPfpName(currentTeamId, userId));
                  await invalidateMultipleKeys(queryClient, [["userInfo"]]);
                } catch (e) {
                  console.log(e);
                  showDialog("Error", getErrorString(e));
                }
                setRemoveLoading(false);
                hideUploadModal();
              }}
              labelStyle={styles.removeButtonText}
              loading={removeLoading}
              textColor={themeColors.accent}
            >
              Remove
            </Button>
            <Button
              style={styles.button}
              onPress={async () => {
                setUploadLoading(true);
                try {
                  await handleImageUpload(
                    setImageUploading,
                    showSnackBar,
                    getPfpName(currentTeamId, userId),
                    userRef,
                    profilePicSize,
                    profilePicSize,
                  );
                  await invalidateMultipleKeys(queryClient, [["userInfo"]]);
                } catch (e) {
                  console.log(e);
                  showDialog("Error", getErrorString(e));
                }
                setUploadLoading(false);
                hideUploadModal();
              }}
              loading={uploadLoading}
              mode="contained"
              labelStyle={styles.uploadButtonText}
              buttonColor={themeColors.accent}
              textColor="white"
            >
              {userData.pfp ? "Change" : "Upload"}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <SafeAreaView style={{ flex: 1 }} edges={["right", "top", "left"]}>
        <Header
          title={"Personal Profile"}
          postChildren={
            <Appbar.Action
              icon="cog"
              color={themeColors.accent}
              onPress={() => {
                bottomSheetModalRef.current?.present();
                setListFlag(false);
                console.log("BROO");
              }}
              style={{ marginRight: 7 }}
            />
          }
        />
        <BottomSheetWrapper
          ref={bottomSheetModalRef}
          closeFn={
            listFlag
              ? () => {
                  console.log("TEST");
                  setListFlag(false);
                }
              : () => {
                  console.log("BRUHHHHH");
                  resetForm();
                  setNewName(userData.name);
                  setPasswordInputVisible(false);
                }
          }
          closeButtonText={listFlag ? "< Back" : "Close"}
          listFlag={listFlag}
        >
          {listFlag && (
            <>
              <BottomSheetScrollView>
                <View style={styles.editModal}>
                  <Text style={styles.editModalTitleText}>
                    Edit Profile Picture
                  </Text>
                  <Text
                    style={styles.editModalContentText}
                  >{`${userData.pfp ? "Change the current" : "Upload a new"} Profile Picture or Remove the current Profile Picture`}</Text>
                  <Button
                    style={styles.editButtons}
                    onPress={async () => {
                      setUploadLoading(true);
                      try {
                        await handleImageUpload(
                          setImageUploading,
                          showSnackBar,
                          getPfpName(currentTeamId, userId),
                          userRef,
                          profilePicSize,
                          profilePicSize,
                        );
                        await invalidateMultipleKeys(queryClient, [
                          ["userInfo"],
                        ]);
                      } catch (e) {
                        console.log(e);
                        showDialog("Error", getErrorString(e));
                      }
                      setUploadLoading(false);
                      hideUploadModal();
                    }}
                    loading={uploadLoading}
                    mode="contained"
                    labelStyle={styles.uploadButtonText}
                    buttonColor={themeColors.accent}
                    textColor="white"
                  >
                    {userData.pfp ? "Change" : "Upload"}
                  </Button>
                  <Button
                    disabled={userData.pfp ? false : true}
                    style={styles.editButtons}
                    onPress={async () => {
                      setRemoveLoading(true);
                      try {
                        await updateDoc(userRef, {
                          pfp: "",
                        });
                        await removePfp(getPfpName(currentTeamId, userId));
                        await invalidateMultipleKeys(queryClient, [
                          ["userInfo"],
                        ]);
                      } catch (e) {
                        console.log(e);
                        showDialog("Error", getErrorString(e));
                      }
                      setRemoveLoading(false);
                      hideUploadModal();
                    }}
                    labelStyle={styles.removeButtonText}
                    loading={removeLoading}
                    textColor={themeColors.accent}
                  >
                    Remove
                  </Button>
                </View>
              </BottomSheetScrollView>
            </>
          )}

          {!listFlag && (
            <BottomSheetScrollView
              keyboardDismissMode="interactive"
              keyboardShouldPersistTaps="handled"
            >
              <KeyboardAvoiderScrollView>
                <View style={styles.modalContent}>
                  {/* Profile Picture */}
                  <TouchableOpacity
                    onPress={() => {
                      console.log("HIIOI");
                      setListFlag(true);
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
                  <Button
                    style={styles.saveChangesButton}
                    onPress={handleUpdate}
                    textColor={themeColors.highlight}
                    labelStyle={{
                      fontWeight: "bold",
                    }}
                    loading={updateLoading}
                  >
                    Update
                  </Button>

                  {/* Sign Out Button */}
                  <Pressable onPress={handleSignOut}>
                    <Text style={styles.signOutButton}>Sign Out</Text>
                  </Pressable>
                </View>
              </KeyboardAvoiderScrollView>
            </BottomSheetScrollView>
          )}
        </BottomSheetWrapper>
        {uniqueDrills.length > 0 && userData.role === "player" ? (
          <View style={{ flex: 1 }}>
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
          <EmptyScreen
            invalidateKeys={invalidateKeys}
            text={"No drills attempted"}
            preChild={() => profileHeader}
          />
        )}
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
}

export default Index;
