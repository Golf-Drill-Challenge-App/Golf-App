import { MaterialIcons } from "@expo/vector-icons";
import {
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { useQueryClient } from "@tanstack/react-query";
import { SaveFormat, manipulateAsync } from "expo-image-manipulator";
import { MediaTypeOptions, launchImageLibraryAsync } from "expo-image-picker";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as signoutFireBase,
  updatePassword,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
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
import { Image } from "react-native-expo-image-cache";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ActivityIndicator, Appbar } from "react-native-paper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { themeColors } from "~/Constants";
import { getErrorString } from "~/Utility";
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
import { invalidateMultipleKeys } from "~/hooks/invalidateMultipleKeys";
import { useBestAttempts } from "~/hooks/useBestAttempts";
import { useDrillInfo } from "~/hooks/useDrillInfo";
import { useEmailInfo } from "~/hooks/useEmailInfo";
import { useUserInfo } from "~/hooks/useUserInfo";

function Index() {
  const { signOut } = currentAuthContext();
  const { currentUserId, currentTeamId } = currentAuthContext();
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
    data: userLeaderboard,
    error: userLeaderboardError,
    isLoading: userLeaderboardIsLoading,
  } = useBestAttempts({ userId });

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
  const [passwordInputVisible, setPasswordInputVisible] = useState(false);

  const [snackbarVisible, setSnackbarVisible] = useState(false); // State to toggle snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(""); // State to set snackbar message

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    setNewName(userData ? userData.name : "");
    setEmail(userEmail);
  }, [userData, userEmail]);

  if (
    userIsLoading ||
    userEmailIsLoading ||
    userLeaderboardIsLoading ||
    drillInfoIsLoading
  ) {
    return <Loading />;
  }

  if (userError || userEmailError || userLeaderboardError || drillInfoError) {
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

  const uniqueDrills = Object.keys(userLeaderboard).map(
    (drillId) => drillInfo[drillId],
  );

  const firebaseProfileImageUpload = async (uri) => {
    try {
      setImageUploading(true);
      // Fetch the image data from the URI
      const response = await fetch(uri);
      const blob = await response.blob();

      // Get a reference to the Firebase Storage instance
      const storage = getStorage();

      // Create a reference to the storage location where the image will be stored
      const storageRef = ref(storage, userId);

      // Upload the image to Firebase Storage
      const snapshot = await uploadBytes(storageRef, blob);

      console.log("Uploaded the image blob to the Firebase storage:", snapshot);

      // Get the download URL for the uploaded image
      const downloadURL = await getDownloadURL(snapshot.ref);
      await updateDoc(doc(db, "teams", currentTeamId, "users", userId), {
        pfp: downloadURL,
      });
      showSnackBar("Successfully uploaded the profile picture!");
      setImageUploading(false);

      return downloadURL;
    } catch (e) {
      console.log("Error uploading image to Firebase:", e);
      showSnackBar("Error uploading profile picture. Please try again.");
      setImageUploading(false);
      throw e; // Rethrow the error to handle it at the caller's level if needed
    }
  };

  // Function to resize the uploaded image
  const resizeImage = async (uri) => {
    const manipResult = await manipulateAsync(
      uri,
      [{ resize: { width: 300 } }], // Adjust the width as needed; height is adjusted automatically to maintain aspect ratio.
      { /*compress: 0.7,*/ format: SaveFormat.JPEG }, // Uncomment the 'compress' property in case we decide to further reduce the quality.
    );
    return manipResult.uri;
  };

  // Function to handle image upload
  const handleImageUpload = async () => {
    let imageResult = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    // console.log(imageResult);

    if (!imageResult.canceled) {
      const resizedUri = await resizeImage(imageResult.assets[0].uri);
      await firebaseProfileImageUpload(resizedUri)
        .then(() => {
          // invalidate cache on successful image upload
          invalidateMultipleKeys(queryClient, [["userInfo"]]);
        })
        .catch((e) => {
          console.log(e);
          showDialog("Error", getErrorString(e));
        });
    }
  };

  async function handleSignOut() {
    signoutFireBase(auth)
      .then(() => {
        // Sign-out successful.
        signOut();
      })
      .catch((e) => {
        console.log(e);
        showDialog("Error", getErrorString(e));
      });
  }

  const resetForm = () => {
    setNewName(userData.name);
    setCurrentPassword("");
    setNewPassword("");
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
    if (newName && newName !== userData.name) {
      // check if they request to update their name to a new one
      await updateDoc(doc(db, "teams", currentTeamId, "users", userId), {
        name: newName,
      });
      invalidateMultipleKeys(queryClient, [["userInfo"]]);
      bottomSheetModalRef.current.close();
      showSnackBar("Name field updated successfully");
    }

    if (passwordInputVisible && (currentPassword || newPassword)) {
      if (!currentPassword || !newPassword) {
        showDialog("Error", "Please fill out all the fields");
      } else {
        // attempt updating the password
        try {
          // re-authenticate the user and check if the provided current password is valid
          const userCredential = await signInWithEmailAndPassword(
            auth,
            userEmail,
            currentPassword,
          );

          // once re-authenticated, update the password
          updatePassword(userCredential.user, newPassword)
            .then(() => {
              // Update successful
              setCurrentPassword(""); // Clear password fields
              setNewPassword("");
              bottomSheetModalRef.current.close();
              setPasswordInputVisible(false);
              showSnackBar("Password updated successfully");
            })
            .catch((e) => {
              // Update failed
              console.log("password update error:", e.message);
              showDialog(
                "New password is too short",
                "Provided new password must be at least 6 characters long!",
              );
            });
        } catch (e) {
          showDialog("Error", e.message);
          console.log(e.message);
        }
      }
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
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 20,
    },
    profilePicture: {
      width: "100%",
      height: "100%",
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
    changePasswordButton: {
      color: "black",
      fontSize: 16,
      marginBottom: 20, // Increase margin bottom for more spacing
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
            <DialogComponent
              type={"snackbar"}
              visible={snackbarVisible}
              content={snackbarMessage}
              onHide={() => setSnackbarVisible(false)}
            />

            <DialogComponent
              title={dialogTitle}
              content={dialogMessage}
              visible={dialogVisible}
              onHide={() => setDialogVisible(false)}
            />
            <SafeAreaView style={{ flex: 1 }}>
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
                  setPasswordInputVisible(false);
                }}
              >
                <BottomSheetScrollView
                  contentContainerStyle={styles.modalContent}
                  keyboardDismissMode="interactive"
                  keyboardShouldPersistTaps="handled"
                >
                  {/* Profile Picture */}
                  <TouchableOpacity onPress={handleImageUpload}>
                    <View style={styles.profilePictureContainer}>
                      {imageUploading ? (
                        <ActivityIndicator
                          animating={imageUploading}
                          size="large"
                          color={themeColors.accent}
                          style={styles.activityIndicator}
                        />
                      ) : (
                        <Image
                          uri={userData.pfp}
                          style={styles.profilePicture}
                        />
                      )}
                      <View style={styles.penIconContainer}>
                        <MaterialIcons name="edit" size={24} color="black" />
                      </View>
                    </View>
                  </TouchableOpacity>

                  {/* Display Email */}
                  <View style={styles.emailContainer}>
                    <Text style={styles.emailText}>{email}</Text>
                  </View>

                  {/* Name Update input field */}
                  <BottomSheetTextInput
                    style={styles.input}
                    value={newName}
                    onChangeText={(text) => setNewName(text)}
                    placeholder="Update your name"
                  />

                  {/* Change Password Button */}
                  <Pressable
                    onPress={() => {
                      resetForm();
                      setPasswordInputVisible(!passwordInputVisible);
                    }}
                  >
                    <Text style={styles.changePasswordButton}>
                      Change Password
                    </Text>
                  </Pressable>

                  {/* Password Input Field */}
                  {passwordInputVisible && (
                    <>
                      <BottomSheetTextInput
                        style={styles.input}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        placeholder="Enter your current password"
                        secureTextEntry={true}
                      />
                      <BottomSheetTextInput
                        style={styles.input}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="Enter your new password"
                        secureTextEntry={true}
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
                    paddingBottom: Platform.OS === "ios" ? 64 + 50 : 64,
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
                  {profileHeader}
                  <EmptyScreen
                    invalidateKeys={invalidateKeys}
                    text={"No drills attempted yet"}
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
