import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Appbar, PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUnique } from "~/Utility";
import DrillList from "~/components/drillList";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import ProfileCard from "~/components/profileCard";
import { currentAuthContext } from "~/context/Auth";
import { useAttempts } from "~/hooks/useAttempts";
import { useDrillInfo } from "~/hooks/useDrillInfo";
import { useEmailInfo } from "~/hooks/useEmailInfo";
import { useUserInfo } from "~/hooks/useUserInfo";

function RefreshInvalidate(currentTeamId, userId) {
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    const refresh = async () => {
      await queryClient.invalidateQueries({
        // used predicate as it seemed to be the best method to invalidate multiple query keys
        predicate: (query) =>
          (query.queryKey[0] === "user" && query.queryKey[1] === userId) ||
          (query.queryKey[0] === "attempts" &&
            query.queryKey[1] === currentTeamId &&
            query.queryKey[2].userId === userId) ||
          query.queryKey[0] === "drillInfo",
      });
      setRefreshing(false);
    };
    refresh();
  }, [queryClient, currentTeamId, userId]);
  return <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />;
}

function Index() {
  const userId = useLocalSearchParams()["user"];
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { currentTeamId } = currentAuthContext();
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

  if (
    userIsLoading ||
    userEmailIsLoading ||
    drillInfoIsLoading ||
    attemptsIsLoading
  ) {
    return <Loading />;
  }

  if (userError || userEmailError || drillInfoError || attemptsError) {
    return (
      <ErrorComponent
        message={[userError, userEmailError, drillInfoError, attemptsError]}
      />
    );
  }

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
      <SafeAreaView style={{ flex: 1 }} edges={["right", "top", "left"]}>
        <Appbar.Header statusBarHeight={0} style={{ backgroundColor: "FFF" }}>
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack();
            }}
            color={"#F24E1E"}
          />
          <Appbar.Content title={userData["name"] + "'s Profile"} />
        </Appbar.Header>
        {uniqueDrills.length > 0 ? (
          <DrillList
            drillData={uniqueDrills}
            href={"/content/team/users/" + userData["uid"] + "/drills/"}
          >
            {profileHeader}
          </DrillList>
        ) : (
          <>
            {profileHeader}
            <Text style={styles.noDrillsText}>No drills attempted yet</Text>
          </>
        )}
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
