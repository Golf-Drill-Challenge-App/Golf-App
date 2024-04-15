import { router } from "expo-router";
import { useEffect, useState } from "react";
import { SectionList, TouchableOpacity, View } from "react-native";
import { List, PaperProvider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import Loading from "~/components/loading";
import RefreshInvalidate from "~/components/refreshInvalidate";
import { currentAuthContext } from "~/context/Auth";
import { useDrillInfo } from "~/hooks/useDrillInfo";
import { useUserInfo } from "~/hooks/useUserInfo";

import { formatDate } from "~/Utility";
import Header from "~/components/header";
import EmptyScreen from "../../../components/emptyScreen";
import ErrorComponent from "../../../components/errorComponent";

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

  const [assignedData, setAssignedData] = useState([]);

  // console.log("USER DATA", userInfo);

  // Set the assigned_data state when the user data is loaded
  useEffect(() => {
    if (!userIsLoading && userInfo && userInfo.assigned_data) {
      setAssignedData(userInfo.assigned_data);
    }
  }, [userIsLoading, userInfo]);

  if (userIsLoading || drillInfoIsLoading) {
    return <Loading />;
  }

  if (userInfoError || drillInfoError) {
    return <ErrorComponent message={[userInfoError, drillInfoError]} />;
  }

  const today = formatDate(Date.now());
  // Group the assigned drills by date
  const groupedData = assignedData.reduce((acc, curr) => {
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
      keyExtractor={(item, index) => `${item.assignedTime}-${item.drillId}`}
      renderItem={({ item: assignment }) => (
        <TouchableOpacity
          key={`${assignment.assignedTime}-${assignment.drillId}`}
          disabled={assignment.completed}
          onPress={() => {
            router.push({
              pathname: `content/drill/${assignment.drillId}`,
              params: {
                id: `${assignment.drillId}`,
                assignedTime: assignment.assignedTime,
              },
            });
          }}
        >
          <View style={{ marginLeft: 20, marginRight: 20 }}>
            <View
              style={{
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.2)",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                height: 65,
                backgroundColor: `${!assignment.completed ? "#fff" : "#89E894"}`,
                borderRadius: 20,
                marginBottom: 10,
                paddingLeft: 30,
                paddingRight: 30,
                paddingTop: 5,
                paddingBottom: 5,
              }}
            >
              <Text style={{ fontSize: 20 }}>
                {drillInfo[assignment.drillId]["drillType"]}
              </Text>
              <Text style={{ fontSize: 17, fontStyle: "italic" }}>
                {drillInfo[assignment.drillId]["subType"]}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
      renderSectionHeader={({ section: { title } }) => (
        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 10,
          }}
        >
          {title}
        </Text>
      )}
      stickySectionHeadersEnabled={false}
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
    <PaperProvider>
      <SafeAreaView style={{ flex: 1 }} edges={["right", "top", "left"]}>
        <Header title="Assigned Drills" />

        <DrillList />
      </SafeAreaView>
    </PaperProvider>
  );
}
