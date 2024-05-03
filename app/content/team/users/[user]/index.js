import { useLocalSearchParams, useNavigation } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Appbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "~/Constants";
import { getUnique } from "~/Utility";
import DrillList from "~/components/drillList";
import EmptyScreen from "~/components/emptyScreen";
import ErrorComponent from "~/components/errorComponent";
import Header from "~/components/header";
import Loading from "~/components/loading";
import PaperWrapper from "~/components/paperWrapper";
import ProfileCard from "~/components/profileCard";
import { useAttempts } from "~/hooks/useAttempts";
import { useDrillInfo } from "~/hooks/useDrillInfo";
import { useEmailInfo } from "~/hooks/useEmailInfo";
import { useUserInfo } from "~/hooks/useUserInfo";

function Index() {
  const userId = useLocalSearchParams()["user"];
  const navigation = useNavigation();
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
    <View style={styles.profileContainer}>
      <ProfileCard user={userData} email={userEmail} />
    </View>
  );

  const invalidateKeys = [
    ["attempts", { userId }],
    ["user", { userId }],
    ["drillInfo"],
  ];

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
          >
            {profileHeader}
          </DrillList>
        ) : (
          <EmptyScreen
            invalidateKeys={invalidateKeys}
            text={"No drills attempted yet."}
            preChild={profileHeader}
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
