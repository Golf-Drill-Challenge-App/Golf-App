import { MaterialIcons } from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as signoutFireBase,
  updatePassword,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Appbar,
  Dialog,
  PaperProvider,
  Portal,
  Snackbar,
  Paragraph,
  Button,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUnique } from "~/Utility";
import DrillCard from "~/components/drillCard";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import ProfileCard from "~/components/profileCard";
import { currentAuthContext } from "~/context/Auth";
import { db } from "~/firebaseConfig";
import { useAttempts } from "~/hooks/useAttempts";
import { useDrillInfo } from "~/hooks/useDrillInfo";
import { useEmailInfo } from "~/hooks/useEmailInfo";
import { useUserInfo } from "~/hooks/useUserInfo";

function Index(props) {
  const { signOut } = currentAuthContext();
  const { currentUserId } = currentAuthContext();
  const userId = currentUserId ?? null;
  const auth = getAuth();

  const {
    data: userData,
    userError: userError,
    userIsLoading: userIsLoading,
  } = useUserInfo(userId);

  const {
    userEmail: userEmail,
    userEmailError: userEmailError,
    userEmailIsLoading: userEmailIsLoading,
  } = useEmailInfo(userId);

  async function handleSignOut() {
    signoutFireBase(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((e) => {
        alert(e);
        console.log(e);
      });
    signOut();
  }

  const {
    data: attempts,
    error: attemptsError,
    isLoading: attemptsIsLoading,
  } = useAttempts({ userId });

  const {
    data: drillInfo,
    error: drillInfoError,
    isLoading: drillInfoIsLoading,
  } = useDrillInfo();

  // ref
  const bottomSheetModalRef = useRef(null);

  // variables
  const initialSnapPoints = useMemo(() => [355, 455, 730], []);
  const expandedSnapPoints = useMemo(() => [460, 570, 860], []); // Adjusted snap points for expanded content
  const [snapPoints, setSnapPoints] = useState(initialSnapPoints);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index) => {
    // console.log("handleSheetChanges", index);
  }, []);

  const [currentName, setCurrentName] = useState("");
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

  const handleSnackbarDismiss = () => {
    setSnackbarVisible(false); // Dismiss snackbar
  };

  useEffect(() => {
    // Check if userData has been loaded and it contains the name property
    if (userData && userData.name) {
      // Update the name state only if it hasn't been set yet
      if (!currentName) {
        setCurrentName(userData.name);
      }
    }
  }, [userData, currentName]); // Watch for changes in userData and name

  useEffect(() => {
    if (currentName) {
      if (!newName) {
        setNewName(currentName);
      }
    }
  }, [currentName, newName]); // Watch for changes in userData and name

  useEffect(() => {
    if (userEmail) {
      setEmail(userEmail); // Set email once userEmail is available
    }
  }, [userEmail]); // Watch for changes in userEmail

  const handleNewNameChange = (text) => {
    setNewName(text);
  };

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handleImageClick = () => {
    console.log("TODO: implement and open an image upload modal!");
  };

  const showChangePasswordField = () => {
    setPasswordInputVisible(!passwordInputVisible); // Toggle password input field visibility

    // Adjust snap points based on password input visibility
    if (passwordInputVisible) {
      setSnapPoints(initialSnapPoints);
      setCurrentPassword(""); // Clear password fields
      setNewPassword("");
    } else {
      setSnapPoints(expandedSnapPoints);
    }
  };

  const handleUpdate = async () => {
    if (newName && newName !== currentName) {     // check if they request to update their name to a new one
      await updateDoc(doc(db, "teams", "1", "users", userId), {
        name: newName,
      });
      setCurrentName(newName);
      bottomSheetModalRef.current.close();
      setSnackbarMessage("Name field updated successfully");
      setSnackbarVisible(true);     // Show success snackbar
    }

    if (email) {
      // TODO: Decide whether we want to allow a user update their email
    }

    if (passwordInputVisible) {
      //if password change field is open and they press update
      if (!currentPassword && !newPassword) {
        setDialogTitle("Error");
        setDialogMessage("Please provide current and new passwords");
        setDialogVisible(true);
      } else if (!currentPassword) {
        setDialogTitle("Error");
        setDialogMessage("Please provide the current password");
        setDialogVisible(true);
      } else if (!newPassword) {
        setDialogTitle("Error");
        setDialogMessage("Please provide the new password");
        setDialogVisible(true);
      } else {
        // attemp updating the password
        try {
          // re-authenticate the user and check if the provided current password is valid
          const userCredential = await signInWithEmailAndPassword(
            auth,
            userEmail,
            currentPassword,
          );
          // console.log("signed in:", userCredential.user);

          // once re-authenticated, update the password
          updatePassword(userCredential.user, newPassword)
            .then(() => {
              // Update successful
              setCurrentPassword(""); // Clear password fields
              setNewPassword("");
              bottomSheetModalRef.current.close();
              setSnackbarMessage("Password updated successfully");
              setSnackbarVisible(true); // Show success snackbar
            })
            .catch((error) => {
              // Update failed
              console.log("password update error:", error.message);
              setDialogTitle("New password is too short");
              setDialogMessage("Provided new password must be at least 6 characters long!");
              setDialogVisible(true);
              console.log(e.message);
            });
        } catch (e) {
          setDialogTitle("Error");
          setDialogMessage("Provided current password is invalid!");
          setDialogVisible(true);
          console.log(e.message);
        }
      }
    }
  };

  if (userIsLoading || drillInfoIsLoading || attemptsIsLoading) {
    return <Loading />;
  }

  if (userError || drillInfoError || attemptsError) {
    return (
      <ErrorComponent message={[userError, drillInfoError, attemptsError]} />
    );
  }

  const uniqueDrills = getUnique(attempts, "did");

  return (
    <PaperProvider>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={handleSnackbarDismiss}
        duration={4000} // Duration in milliseconds for how long the snackbar is shown
      >
        {snackbarMessage}
      </Snackbar>

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Title>{dialogTitle}</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{dialogMessage}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <SafeAreaView style={{ flex: 1 }}>
        <Appbar.Header statusBarHeight={0} style={{ backgroundColor: "FFF" }}>
          <Appbar.Content title={"Personal Profile"} />
          <Appbar.Action
            icon="cog"
            color={"#F24E1E"}
            onPress={handlePresentModalPress}
            style={{ marginRight: 7 }}
          />
        </Appbar.Header>

        <BottomSheetModalProvider>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.profileContainer}>
              <ProfileCard user={{ ...userData, name: currentName }} />
            </View>

            <Text style={styles.heading}>Drill History</Text>

            {uniqueDrills.length > 0 ? (
              uniqueDrills.map((drill) => {
                const drillId = drill["did"];
                return (
                  <DrillCard
                    drill={drillInfo[drillId]}
                    hrefString={"content/profile/drills/" + drillId}
                    key={drillId}
                  />
                );
              })
            ) : (
              <Text style={styles.noDrillsText}>No drills attempted yet</Text>
            )}

            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={1}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}
            >
              <View style={styles.modalContent}>
                {/* Close Button */}
                <Pressable
                  onPress={() => bottomSheetModalRef.current.close()}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </Pressable>

                {/* Profile Picture */}
                <View style={styles.profilePictureContainer}>
                  <TouchableOpacity onPress={handleImageClick}>
                    <Image
                      source={{ uri: userData.pfp }}
                      style={styles.profilePicture}
                    />
                  </TouchableOpacity>
                  <View style={styles.penIconContainer}>
                    <TouchableOpacity onPress={handleImageClick}>
                      <MaterialIcons name="edit" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>

                <TextInput
                  style={styles.input}
                  value={newName}
                  onChangeText={handleNewNameChange}
                  placeholder="Enter your name"
                />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={handleEmailChange}
                  placeholder="Enter your email"
                />

                {/* Change Password Button */}
                <Pressable onPress={showChangePasswordField}>
                  <Text style={styles.changePasswordButton}>
                    Change Password
                  </Text>
                </Pressable>

                {/* Password Input Field */}
                {passwordInputVisible && (
                  <>
                    <TextInput
                      style={styles.input}
                      value={currentPassword}
                      onChangeText={setCurrentPassword}
                      placeholder="Enter your current password"
                      secureTextEntry={true}
                    />
                    <TextInput
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
              </View>
            </BottomSheetModal>
          </ScrollView>
        </BottomSheetModalProvider>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 4,
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
  modalContent: {
    backgroundColor: "#FFF",
    padding: 30, // Increase padding for more spacing
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  closeButtonText: {
    color: "red",
    fontSize: 17,
    marginLeft: 10,
    marginTop: -10,
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
    backgroundColor: "#d6d6d6",
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
    backgroundColor: "#F24E1E",
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
    color: "red",
    fontSize: 16,
  },
});

export default Index;
