import { useLocalSearchParams, useNavigation } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Appbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "~/Constants";
import DrillList from "~/components/drillList";
import EmptyScreen from "~/components/emptyScreen";
import ErrorComponent from "~/components/errorComponent";
import Header from "~/components/header";
import Loading from "~/components/loading";
import PaperWrapper from "~/components/paperWrapper";
import ProfileCard from "~/components/profileCard";
import { useBestAttempts } from "~/hooks/useBestAttempts";
import { useDrillInfo } from "~/hooks/useDrillInfo";
import { useEmailInfo } from "~/hooks/useEmailInfo";
import { useUserInfo } from "~/hooks/useUserInfo";

function Index() {
  const userId = useLocalSearchParams()["user"];
  const navigation = useNavigation();
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
  const profileHeader = () => (
    <View style={styles.profileContainer}>
      <ProfileCard user={userData} email={userEmail} />
    </View>
  );

  const invalidateKeys = [
    ["best_attempts", { userId }],
    ["userInfo", { userId }],
    ["emailInfo", { userId }],
    ["drillInfo"],
  ];

  const uniqueDrills = Object.keys(userLeaderboard).map(
    (drillId) => drillInfo[drillId],
  );

  return (
    <PaperWrapper>
      <SafeAreaView style={{ flex: 1 }} edges={["right", "top", "left"]}>
        <Header
          title={userData["name"] + "'s Profile"}
          preChildren={
            <Appbar.BackAction
              onPress={() => {
                navigation.goBack();
              }}
              color={themeColors.accent}
            />
          }
        />
        {uniqueDrills.length > 0 ? (
          <DrillList
            drillData={uniqueDrills}
            href={"/content/team/users/" + userData.uid + "/drills/"}
            userId={userData.uid}
            invalidateKeys={invalidateKeys}
          >
            {profileHeader}
          </DrillList>
        ) : (
          <EmptyScreen
            invalidateKeys={invalidateKeys}
            text={"No drills attempted yet."}
            preChild={() => {
              profileHeader;
            }}
          />
        )}
      </SafeAreaView>
    </PaperWrapper>
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
