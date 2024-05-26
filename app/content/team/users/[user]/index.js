import { useLocalSearchParams, useNavigation } from "expo-router";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { Appbar, SegmentedButtons } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "~/Constants";
import AssignmentsList from "~/components/assignmentList";
import DrillList from "~/components/drillList";
import EmptyScreen from "~/components/emptyScreen";
import ErrorComponent from "~/components/errorComponent";
import Header from "~/components/header";
import Loading from "~/components/loading";
import PaperWrapper from "~/components/paperWrapper";
import ProfileCard from "~/components/profileCard";
import { currentAuthContext } from "~/context/Auth";
import { useBestAttempts } from "~/hooks/useBestAttempts";
import { useDrillInfo } from "~/hooks/useDrillInfo";
import { useEmailInfo } from "~/hooks/useEmailInfo";
import { useUserInfo } from "~/hooks/useUserInfo";

function Index() {
  const userId = useLocalSearchParams()["user"];
  const { currentUserId } = currentAuthContext();
  const navigation = useNavigation();
  const {
    data: userInfo,
    error: userError,
    isLoading: userIsLoading,
  } = useUserInfo({ userId });

  const {
    data: currentUserInfo,
    error: currentUserError,
    isLoading: currentUserIsLoading,
  } = useUserInfo({ userId: currentUserId });

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

  const [value, setValue] = useState("drills");

  const invalidateKeys = [
    ["userInfo", { userId }],
    ["userInfo", { userId: currentUserId }],
    ["emailInfo", { userId }],
    ["drillInfo"],
  ];

  if (userIsLoading || userEmailIsLoading || drillInfoIsLoading ||
    currentUserIsLoading) {
    return <Loading />;
  }

  if (userError || userEmailError || drillInfoError ||
    currentUserError) {
    return (
      <ErrorComponent errorList={[userError, userEmailError, drillInfoError,
        currentUserError,]} />
    );
  }
  const profileHeader = () => (
    <View
      style={{
        alignItems: "center",
        marginBottom: 20,
      }}
    >
      <ProfileCard user={userInfo} email={userEmail} />
    </View>
  );

  const uniqueDrills = userInfo["uniqueDrills"].map(
    (drillId) => drillInfo[drillId],
  );
  const segmentButtons = () => {
    return (
      <>
        {currentUserInfo["role"] !== "player" && (
          <SegmentedButtons
            value={value}
            onValueChange={setValue}
            style={{
              marginLeft: 10,
              marginRight: 10,
              backgroundColor: themeColors.highlight,
              borderRadius: 20,
              position: "sticky",
            }}
            theme={{
              colors: {
                secondaryContainer: themeColors.overlay,
              },
            }}
            buttons={[
              {
                value: "drills",
                label: "Drills",
              },
              {
                value: "assignments",
                label: "Assignments",
              },
            ]}
          />
        )}
      </>
    );
  };

  const DrillScreen = () => (
    <>
      {uniqueDrills.length > 0 ? (
        <DrillList
          drillData={uniqueDrills}
          href={"/content/team/users/" + userInfo.uid + "/drills/"}
          userId={userInfo.uid}
          invalidateKeys={invalidateKeys}
        ></DrillList>
      ) : (
        <EmptyScreen
          invalidateKeys={invalidateKeys}
          text={"No drills attempted yet."}
        />
      )}
    </>
  );

  const AssignmentScreen = () => (
    <AssignmentsList
      role={currentUserInfo["role"]}
      userInfo={userInfo}
      invalidateKeys={invalidateKeys}
      drillInfo={drillInfo}
    ></AssignmentsList>
  );

  const tabComponent = {
    drills: <DrillScreen />,
    assignments: <AssignmentScreen />,
  };

  return (
    <PaperWrapper>
      <SafeAreaView style={{ flex: 1 }} edges={["right", "top", "left"]}>
        <Header
          title={userInfo["name"] + "'s Profile"}
          preChildren={
            <Appbar.BackAction
              onPress={() => {
                navigation.goBack();
              }}
              color={themeColors.accent}
            />
          }
        />
        <FlatList
          stickyHeaderIndices={[1]}
          data={[
            profileHeader(),
            segmentButtons(),
            <View>{tabComponent[value]}</View>,
          ]}
          renderItem={({ item }) => item}
        />
      </SafeAreaView>
    </PaperWrapper>
  );
}

export default Index;
