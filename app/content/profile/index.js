import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useNavigation } from "expo-router";
import { useContext } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
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
  const { signOut } = useAuth();
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

  if (userIsLoading || drillInfoIsLoading || attemptsIsLoading) {
    return <Loading />;
  }

  if (userError || drillInfoError || attemptsError) {
    return (
      <ErrorComponent message={[userError, drillInfoError, attemptsError]} />
    );
  }

  const uniqueDrills = getUnique(attempts, "did");

  // ref
  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

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
        </ScrollView>
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
    height: "100%",
  },
  noDrillsText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    color: "gray",
  },
});

export default Index;
