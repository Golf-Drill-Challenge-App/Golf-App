import { useState } from "react";
import { SectionList, View } from "react-native";
import { Divider, List, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
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

import DrillCard from "../../../components/drillCard";

const DrillList = () => {
  const { currentUserId } = currentAuthContext();

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

  Object.keys(groupedData).forEach((date) => {
    groupedData[date] = groupedData[date].sort((a, b) => {
      const completedComparison = a["completed"] - b["completed"];
      if (completedComparison !== 0) {
        return completedComparison;
      }
      // First, compare by drillType
      const typeComparison = drillInfo[a["drillId"]]["drillType"].localeCompare(
        drillInfo[b["drillId"]]["drillType"],
      );
      if (typeComparison !== 0) {
        return typeComparison;
      }
      // If drillType is the same, then compare by subType
      return drillInfo[a["drillId"]]["subType"].localeCompare(
        drillInfo[b["drillId"]]["subType"],
      );
    });
  });

  // Sort the dates in descending order
  const sortedDates = Object.keys(groupedData).sort(
    (a, b) => new Date(b) - new Date(a),
  );

  // Render the list of drills
  return sortedDates.length === 0 ? (
    <EmptyScreen invalidateKeys={invalidateKeys} text={"No drills assigned"} />
  ) : (
    <SectionList
      style={{ paddingHorizontal: 20, height: "100%" }}
      sections={sortedDates.map((date) => ({
        title: date,
        data: groupedData[date],
      }))}
      keyExtractor={(item) => `${item.assignedTime}-${item.drillId}`}
      renderItem={({ item: assignment }) => (
        <DrillCard
          key={`${assignment.assignedTime}-${assignment.drillId}`}
          leftString={drillInfo[assignment.drillId]["drillType"]}
          rightString={drillInfo[assignment.drillId]["subType"]}
          hrefString={`content/drill/${assignment.drillId}`}
          greyed={assignment.completed}
        />
      )}
      renderSectionHeader={({ section: { title } }) => (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            paddingVertical: 5,
            backgroundColor: "#F2F2F2",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>{title}</Text>
          <Divider bold={true} />
        </View>
      )}
      refreshControl={<RefreshInvalidate invalidateKeys={invalidateKeys} />}
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
