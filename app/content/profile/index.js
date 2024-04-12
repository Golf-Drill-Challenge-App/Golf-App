import { MaterialIcons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
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
  Image,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Appbar, PaperProvider, Snackbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUnique } from "~/Utility";
import DialogComponent from "~/components/dialog";
import DrillList from "~/components/drillList";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import ProfileCard from "~/components/profileCard";
import { currentAuthContext } from "~/context/Auth";
import { db } from "~/firebaseConfig";
import { useAttempts } from "~/hooks/useAttempts";
import { useDrillInfo } from "~/hooks/useDrillInfo";
import { useEmailInfo } from "~/hooks/useEmailInfo";
import { useUserInfo } from "~/hooks/useUserInfo";

function RefreshInvalidate({ queryKeys }) {
  //console.log("GERONIMOOOO")
  //console.log(currentTeamId)
  //console.log(userId)
  // console.log("JOHNNYYYYY");
  // console.log(queryKeys);
  // console.log(Object.keys(queryKeys))
  /*
  for (let i = 0; i < Object.keys(queryKeys).length; i++) {
    //console.log(Object.keys(queryKeys)[i]);
    if (typeof Object.values(queryKeys)[i] === "object") {
      //console.log(Object.values(Object.values(queryKeys)[i]));
    } else {
      //console.log(Object.values(queryKeys)[i]);
    }
  }
  */
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    const refresh = async () => {
      await queryClient.invalidateQueries({
        // used predicate as it seemed to be the best method to invalidate multiple query keys
        predicate: (query) => {
          console.log("\nhere")
          //console.log(query.queryKey)
          //console.log(queryKeys)
          for (let i = 0; i < query.queryKey.length; i++) {
            //console.log(queryKeys[i])
            //console.log(i)
            //console.log(query.queryKey[i])
            if (queryKeys[i] && queryKeys[i][0] === query.queryKey[0]) {
              function checkLists(firstList, secondList) {
                // Check each item in the first list
                for (let item of firstList) {
                    if (typeof item === 'string') {
                        // If item is a string, check if it exists in the second list
                        if (!secondList.includes(item)) {
                            return false;
                        }
                    } else if (typeof item === 'object') {
                        // If item is an object, check if it exists as a subset in the second list
                        let found = false;
                        for (let obj of secondList) {
                            if (isObjectSubset(item, obj)) {
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            return false;
                        }
                    }
                }
                return true;
            }
            
            function isObjectSubset(subset, superset) {
              // Check if superset is an object
              if (typeof superset !== 'object' || superset === null) {
                  return false;
              }
              
              // Check if each key-value pair in the subset exists in the superset
              for (let key in subset) {
                  if (!(key in superset && superset[key] === subset[key])) {
                      return false;
                  }
              }
              return true;
          }
            console.log(queryKeys[i])
            console.log(query.queryKey)
            //const firstList = ["attempts", "1", {"userId": "Oo6vMXo5I0P6aWMZD9j5zQVkCwx2"}];
            //const secondList = ["attempts", "1", {"attemptId": null, "drillId": "SpvYyY94HaulVH2zmVyM", "userId": "Oo6vMXo5I0P6aWMZD9j5zQVkCwx2"}];
            console.log(checkLists(queryKeys[i], query.queryKey));
            return checkLists(queryKeys[i], query.queryKey)
            
              /*
              console.log(queryKeys[i])
              console.log(query.queryKey)
              let queryKeyFlat = []
              for (let j = 0; j < queryKeys[i].length;  j++) {
                if (typeof(queryKeys[i][j]) === "object") {
                  queryKeyFlat.push(...Object.values(queryKeys[i][j]))
                } else{
                  queryKeyFlat.push(queryKeys[i][j])
                }
              }
              //console.log(queryKeyFlat)
              let queryQueryKeyFlat = []
              for (let k = 0; k < query.queryKey.length;  k++) {
                if (typeof(query.queryKey[k]) === "object") {
                  let testArr = [...Object.values(query.queryKey[k])]
                  for (let i=0; i<testArr.length; i++) {
                    if (testArr[i]) {
                      queryQueryKeyFlat.push(testArr[i])
                    }
                  }
                } else if (query.queryKey[k]) {
                  queryQueryKeyFlat.push(query.queryKey[k])
                }
              }
              // console.log(queryQueryKeyFlat)
              const isSubset = (array1, array2) =>
              array2.every((element) => array1.includes(element));
              // console.log(isSubset(queryKeyFlat, queryQueryKeyFlat))
              */
              /*
              function isBigEnough(element, index, array) {
                if (typeof(element) === "object"){
                  for (let k = 0; k < element.length; k++) {
                    let inputKey = Object.keys(element)[k]
                    if(queryKeys[i][j][inputKey]===query.queryKey[i][inputKey]) {
                      // console.log(queryKeys[i][j])
                    }
                  }
                }
                else if (typeof(queryKeys[i][j]) === "string") {
                  if (queryKeys[i][j] === query.queryKey[i]) {
                    //console.log(query.queryKey[i])
                  }
                }
              }
              */
              /*
              for (let j = 0; j < queryKeys[i].length; j++) {
                //console.log(queryKeys[i][j])
                if (typeof(queryKeys[i][j]) === "object"){
                  for (let k = 0; k < Object.keys(queryKeys[i][j]).length; k++) {
                    let inputKey = Object.keys(queryKeys[i][j])[k]
                    if(queryKeys[i][j][inputKey]===query.queryKey[i][inputKey]) {
                      // console.log(queryKeys[i][j])
                    }
                  }
                }
                else if (typeof(queryKeys[i][j]) === "string") {
                  if (queryKeys[i][j] === query.queryKey[i]) {
                    //console.log(query.queryKey[i])
                  }
                }
              }
              */
            }
          }
          // for (let i = 0; i< query.queryKey.length; i++) {
           // console.log(query.queryKey[i])
          //}
          // console.log('\nhmm')
          // console.log(query.queryKey)
          /*
          for (let i = 0; i < query.queryKey.length; i++) {
            //console.log("\nyuhh")
            //console.log(query.queryKey[i])
            // console.log(Object.keys(queryKeys)[i]);
            if (typeof query.queryKey[i] === "object") {
              // console.log(Object.values(query.queryKey[i]));
            } else {
              //console.log(query.queryKey[i]);
            }
          }*/
        }
      })
      console.log("hellooo")
      setRefreshing(false);
    };
    refresh();
  }, [queryClient]);
  return <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />;
}

function Index() {
  const { signOut } = currentAuthContext();
  const { currentUserId, currentTeamId } = currentAuthContext();
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
  const queryClient = useQueryClient(); // also called here for updating name

  // variables
  const [snapPoints, setSnapPoints] = useState(["60%", "60%"]);
  const [isTyping, setIsTyping] = useState(false);

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

  useEffect(() => {
    setNewName(userData ? userData.name : "");
    setEmail(userEmail);
  }, [userData, userEmail]);

  useEffect(() => {
    setSnapPoints(passwordInputVisible ? ["35%", "70%"] : ["25%", "57%"]);
  }, [passwordInputVisible]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        passwordInputVisible
          ? setSnapPoints(["45%", "93%"])
          : setSnapPoints(["40%", "83%"]);
        setIsTyping(true);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setSnapPoints(passwordInputVisible ? ["35%", "70%"] : ["25%", "57%"]);
        setIsTyping(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [passwordInputVisible]);

  if (
    userIsLoading ||
    drillInfoIsLoading ||
    attemptsIsLoading ||
    userEmailIsLoading
  ) {
    return <Loading />;
  }

  if (userError || drillInfoError || attemptsError || userEmailError) {
    return (
      <ErrorComponent
        message={[userError, drillInfoError, attemptsError, userEmailError]}
      />
    );
  }

  const handleImageClick = () => {
    console.log("TODO: implement and open an image upload modal!");
  };

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

  const handleUpdate = async () => {
    if (newName && newName !== userData.name) {
      // check if they request to update their name to a new one
      await updateDoc(doc(db, "teams", currentTeamId, "users", userId), {
        name: newName,
      });
      queryClient.invalidateQueries({ queryKey: ["user", { userId }] });
      bottomSheetModalRef.current.close();
      setSnackbarMessage("Name field updated successfully");
      setSnackbarVisible(true); // Show success snackbar
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
              setSnackbarMessage("Password updated successfully");
              setSnackbarVisible(true); // Show success snackbar
            })
            .catch((error) => {
              // Update failed
              console.log("password update error:", error.message);
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

  const uniqueDrills = getUnique(attempts, Object.values(drillInfo));

  const profileHeader = (
    <>
      <View style={styles.profileContainer}>
        <ProfileCard user={userData} email={userEmail} />
      </View>
      <View>
        <Text style={styles.heading}>Drill History</Text>
      </View>
    </>
  );

  return (
    <PaperProvider>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000} // Duration in milliseconds for how long the snackbar is shown
      >
        {snackbarMessage}
      </Snackbar>

      <DialogComponent
        title={dialogTitle}
        content={dialogMessage}
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        buttons={["OK"]}
        buttonsFunctions={[() => setDialogVisible(false)]}
      />

      <SafeAreaView style={{ flex: 1 }} edges={["right", "top", "left"]}>
        <Appbar.Header statusBarHeight={0} style={{ backgroundColor: "FFF" }}>
          <Appbar.Content title={"Personal Profile"} />
          <Appbar.Action
            icon="cog"
            color={"#F24E1E"}
            onPress={() => bottomSheetModalRef.current?.present()}
            style={{ marginRight: 7 }}
          />
        </Appbar.Header>

        <BottomSheetModalProvider>
          {uniqueDrills.length > 0 ? (
            <DrillList
              drillData={uniqueDrills}
              href={"content/profile/drills/"}
            >
              {profileHeader}
            </DrillList>
          ) : (
            <>
              {profileHeader}
              <Text style={styles.noDrillsText}>No drills attempted yet</Text>
            </>
          )}

          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            backdropComponent={BottomSheetBackdrop}
          >
            <View style={styles.modalContent}>
              {/* Close Button */}
              <Pressable
                onPress={() => {
                  bottomSheetModalRef.current.close();
                  resetForm();
                  setPasswordInputVisible(false);
                }}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>

              {/* Profile Picture */}
              <TouchableOpacity onPress={handleImageClick}>
                <View style={styles.profilePictureContainer}>
                  <Image
                    source={{ uri: userData.pfp }}
                    style={styles.profilePicture}
                  />
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
              <TextInput
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
                <Text style={styles.changePasswordButton}>Change Password</Text>
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
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  noDrillsText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    color: "gray",
  },
  modalContent: {
    backgroundColor: "#FFF",
    paddingHorizontal: 30, // Increase padding for more spacing
    paddingVertical: Platform.OS === "android" ? 10 : 30,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  closeButtonText: {
    color: "#F24D1F",
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
    color: "#F24D1F",
    fontSize: 16,
  },
});

export default Index;
