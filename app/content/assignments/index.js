import { router } from "expo-router";
import { useState } from "react";
import { LogBox, SectionList, TouchableOpacity, View } from "react-native";
import { Icon, List, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "~/Constants";
import { formatDate } from "~/Utility";
import EmptyScreen from "~/components/emptyScreen";
import ErrorComponent from "~/components/errorComponent";
import Header from "~/components/header";
import Loading from "~/components/loading";
import PaperWrapper from "~/components/paperWrapper";
import RefreshInvalidate from "~/components/refreshInvalidate";
import { currentAuthContext } from "~/context/Auth";
import { useDrillInfo } from "~/hooks/useDrillInfo";
import { useUserInfo } from "~/hooks/useUserInfo";

const DrillList = () => {
  const { currentUserId, currentTeamId } = currentAuthContext();

  const {
    data: drillInfo,
    error: drillInfoError,
    isLoading: drillInfoIsLoading,
  } = useDrillInfo();

  const {
    data: userInfo,
    userError: userInfoError,
    userIsLoading: userIsLoading,
  } = useUserInfo(currentUserId);

  const userId = currentUserId;
  const invalidateKeys = [["user", { userId }], ["drillInfo"]];

  // Handle both errors of 'cannot read property "reduce" of undefined' and
  // 'data is undefined' / 'Query data cannot be undefined' (useUserInfo hook error)
  if (
    !currentUserId ||
    (userInfoError && String(userInfoError).includes("data is undefined"))
  ) {
    // The logs still show up on the console (which is probably good), just hidden from phone screen
    LogBox.ignoreLogs(["Query data cannot be undefined"]);
    return (
      <EmptyScreen
        invalidateKeys={invalidateKeys}
        text={"No drills assigned"}
      />
    );
  }

  if (userIsLoading || drillInfoIsLoading) {
    return <Loading />;
  }

  if (userInfoError || drillInfoError) {
    return <ErrorComponent message={[userInfoError, drillInfoError]} />;
  }

  const today = formatDate(Date.now());
  // Group the assigned drills by date
  const groupedData = userInfo.assigned_data.reduce((acc, curr) => {
    const date = formatDate(curr.assignedTime);
    const dateKey = date === today ? "Today" : date;

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    if (curr.completed) {
      acc[dateKey].push(curr);
    } else {
      acc[dateKey].unshift(curr);
    }

    return acc;
  }, {});

  // Sort the dates in descending order
  const sortedDates = Object.keys(groupedData).sort(
    (a, b) => new Date(b) - new Date(a),
  );

  // Render the list of drills
  return sortedDates.length === 0 ? (
    <EmptyScreen invalidateKeys={invalidateKeys} text={"No drills assigned"} />
  ) : (
    <SectionList
      sections={sortedDates.map((date) => ({
        title: date,
        data: groupedData[date],
      }))}
      keyExtractor={(item) => `${item.assignedTime}-${item.drillId}`}
      renderItem={({ item: assignment }) => (
        <TouchableOpacity
          key={`${assignment.assignedTime}-${assignment.drillId}`}
          disabled={assignment.completed}
          onPress={() => {
            router.push({
              pathname: `content/drill`,
              params: {
                id: `${assignment.drillId}`,
                assignedTime: assignment.assignedTime,
                currentTime: new Date(),
              },
            });
          }}
        >
          <View style={{ marginLeft: 20, marginRight: 20 }}>
            <View
              style={{
                flexDirection: "row",
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.2)",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                height: 65,
                backgroundColor: themeColors.highlight,
                borderRadius: 20,
                marginBottom: 10,
                paddingLeft: 30,
                paddingRight: 30,
                paddingTop: 5,
                paddingBottom: 5,
              }}
            >
              <View style={{ flexDirection: "column" }}>
                <Text style={{ fontSize: 20 }}>
                  {drillInfo[assignment.drillId]["subType"]}
                </Text>
                <Text style={{ fontSize: 14, color: "grey" }}>
                  {drillInfo[assignment.drillId]["drillType"]}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {assignment.completed && (
                  <Icon source="check" size={28} color="green" />
                )}
                <View style={{ paddingLeft: 10 }}>
                  <Icon source="chevron-right" size={20} />
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}
      renderSectionHeader={({ section: { title } }) => (
        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            textAlign: "left",
            marginLeft: 20,
            paddingBottom: 3,
            backgroundColor: themeColors.background,
          }}
        >
          {title}
        </Text>
      )}
      stickySectionHeadersEnabled={true}
      refreshControl={
        // handle updating cache for another user list of drills
        <RefreshInvalidate invalidateKeys={invalidateKeys} />
      }
    />
  );
};

const CoachView = () => {
  const {
    data: drillInfo,
    error: drillInfoError,
    isLoading: drillInfoIsLoading,
  } = useDrillInfo();

  const [expanded, setExpanded] = useState(true);

  const handlePress = () => setExpanded(!expanded);
  if (drillInfoIsLoading) {
    return <Loading />;
  }
  if (drillInfoError) {
    return <ErrorComponent message={drillInfoError.message} />;
  }
  return (
    <List.Section>
      <List.Accordion
        title="Select Drills"
        left={(props) => <List.Icon {...props} icon="folder" />}
      >
        {drillInfo &&
          Object.values(drillInfo).map((drill) => (
            <List.Item title={drill.drillType} />
          ))}
      </List.Accordion>
    </List.Section>
  );
};

export default function Index() {
  return (
    <PaperWrapper>
      <SafeAreaView style={{ flex: 1 }} edges={["right", "top", "left"]}>
        <Header title="Assigned Drills" />

        <DrillList />
      </SafeAreaView>
    </PaperWrapper>
  );
}
