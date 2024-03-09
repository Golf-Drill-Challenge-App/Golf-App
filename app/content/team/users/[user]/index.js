import { useLocalSearchParams, useNavigation } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Appbar, PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { refToID } from "~/Utility";
import DrillCard from "~/components/drillCard";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import ProfileCard from "~/components/profileCard";
import { useAttempts } from "~/hooks/useAttempts";
import { useDrillInfo } from "~/hooks/useDrillInfo";
import { useUserInfo } from "~/hooks/useUserInfo";
import { getUnique } from "../../../../../Utility";

function Index(props) {
  const userId = useLocalSearchParams()["user"];
  const navigation = useNavigation();
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

  return (
    <PaperProvider>
      <SafeAreaView>
        <Appbar.Header statusBarHeight={0} style={{ backgroundColor: "FFF" }}>
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack();
            }}
            color={"#F24E1E"}
          />
          <Appbar.Content title={userData["name"] + "'s Profile"} />
        </Appbar.Header>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.profileContainer}>
            <ProfileCard user={userData} />
          </View>

          <Text style={styles.heading}>Drills</Text>

          {uniqueDrills.length > 0 ? (
            uniqueDrills.map((drill) => {
              const drillId = drill["did"];
              return (
                <DrillCard
                  drill={drillInfo[drillId]}
                  hrefString={
                    "/content/team/users/" +
                    refToID(userData.uid) +
                    "/drills/" +
                    drillId
                  }
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
  },
  noDrillsText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    color: "gray",
  },
});

export default Index;
