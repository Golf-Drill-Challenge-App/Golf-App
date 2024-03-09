import { MaterialIcons } from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useNavigation } from "expo-router";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { Appbar, PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUnique } from "~/Utility";
import DrillCard from "~/components/drillCard";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import ProfileCard from "~/components/profileCard";
import { CurrentUserContext } from "~/contexts/CurrentUserContext";
import { useAttempts } from "~/hooks/useAttempts";
import { useDrillInfo } from "~/hooks/useDrillInfo";
import { useUserInfo } from "~/hooks/useUserInfo";

function Index(props) {
  const navigation = useNavigation();
  const userId = useContext(CurrentUserContext)["currentUser"];
  const {
    data: userData,
    userError: userError,
    userIsLoading: userIsLoading,
  } = useUserInfo(userId);

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
  const snapPoints = useMemo(() => [380, 470, 600], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index) => {
    // console.log("handleSheetChanges", index);
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState(
    "example@gmail.com" /* TODO: !! user["email"]*/,
  );

  useEffect(() => {
    // Check if userData has been loaded and it contains the name property
    if (userData && userData.name) {
      // Update the name state only if it hasn't been set yet
      if (!name) {
        setName(userData.name);
      }
    }
  }, [userData, name]); // Watch for changes in userData and name

  const handleNameChange = (text) => {
    setName(text);
  };

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handleImageClick = () => {
    console.log("TODO: implement and open an image upload modal!");
  };

  const handleChangePassword = () => {
    console.log("TODO: create a separate screen for changing password!");
  };

  const handleSignOut = () => {
    console.log("signing out!");
    // signoutFireBase(auth);
    // signOut();
  };

  const handleNameEmailUpdate = () => {
    console.log("TODO: update user name and eamil in the database!");
    bottomSheetModalRef.current.close();
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
              <ProfileCard user={userData} />
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
                  value={name}
                  onChangeText={handleNameChange}
                  placeholder="Enter your name"
                />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={handleEmailChange}
                  placeholder="Enter your email"
                />
                {/* Save Button */}
                <TouchableOpacity
                  style={styles.saveChangesButton}
                  onPress={handleNameEmailUpdate}
                >
                  <Text style={styles.saveChangesButtonText}>Update</Text>
                </TouchableOpacity>

                {/* Change Password Button */}
                <Pressable onPress={handleChangePassword}>
                  <Text style={styles.changePasswordButton}>
                    Change Password
                  </Text>
                </Pressable>

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
