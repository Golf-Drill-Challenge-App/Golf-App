import { router } from "expo-router";
import { useContext } from "react";
import { LogBox, SectionList, TouchableOpacity, View } from "react-native";
import { Image } from "react-native-expo-image-cache";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "~/Constants";
import { formatDate } from "~/Utility";
import { PlayerContext } from "~/app/content/assignments/context";
import AssignmentCard from "~/components/assignmentCard";
import EmptyScreen from "~/components/emptyScreen";
import ErrorComponent from "~/components/errorComponent";
import Header from "~/components/header";
import Loading from "~/components/loading";
import PaperWrapper from "~/components/paperWrapper";
import RefreshInvalidate from "~/components/refreshInvalidate";
import { currentAuthContext } from "~/context/Auth";
import { useDrillInfo } from "~/hooks/useDrillInfo";
import { useUserInfo } from "~/hooks/useUserInfo";

export default function Index() {
  const { currentUserId } = currentAuthContext();

  const {
    data: drillInfo,
    error: drillInfoError,
    isLoading: drillInfoIsLoading,
  } = useDrillInfo();

  const {
    data: userInfo,
    error: userInfoError,
    isLoading: userIsLoading,
  } = useUserInfo({ userId: currentUserId });

  const {
    data: playerInfo,
    error: playerInfoError,
    isLoading: playerInfoIsLoading,
  } = useUserInfo({
    role: "player",
    enabled: !userIsLoading && userInfo["role"] !== "player",
  });
  const { setPlayerList } = useContext(PlayerContext);

  const invalidateKeys = [["userInfo"], ["drillInfo"]];

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

  if (userIsLoading || drillInfoIsLoading || playerInfoIsLoading) {
    return <Loading />;
  }

  if (userInfoError || drillInfoError || playerInfoError) {
    return <ErrorComponent errorList={[userInfoError, drillInfoError]} />;
  }

  const role = userInfo["role"];

  const today = formatDate(Date.now());

  let assigned_data = userInfo.assigned_data;

  if (userInfo["role"] !== "player") {
    assigned_data = [];
    const alreadyAddedData = {};

    Object.values(playerInfo).forEach((player) => {
      player["assigned_data"].forEach((assignment) => {
        const { assignedTime, drillId, completed, attemptId } = assignment;
        const { uid, pfp, name: userName } = player;

        if (!alreadyAddedData[assignedTime]) {
          alreadyAddedData[assignedTime] = {};
        }

        if (!alreadyAddedData[assignedTime][drillId]) {
          alreadyAddedData[assignedTime][drillId] = {
            assignedTime,
            drillId,
            players: [],
          };
        }

        alreadyAddedData[assignedTime][drillId].players.push({
          pfp,
          userName,
          uid,
          completed,
          attemptId,
        });
      });
    });

    Object.values(alreadyAddedData).forEach((assignedSortedByTime) => {
      Object.values(assignedSortedByTime).forEach((assignedSortedByDrillId) => {
        assigned_data.push(assignedSortedByDrillId);
      });
    });
  }

  // Group the assigned drills by date
  const groupedData = assigned_data.reduce((acc, curr) => {
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

  if (sortedDates.length === 0) {
    return (
      <EmptyScreen
        invalidateKeys={invalidateKeys}
        text={"No drills assigned"}
      />
    );
  }
  const stackedPfp = (playerList) => {
    const numPfp = Math.min(3, playerList.length);

    const pfpArr = playerList.slice(0, numPfp).map((player, index) => {
      return (
        <Image
          key={player.uid} // Assuming each player has a unique 'uid'
          uri={player.pfp}
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            position: "relative",
            left: -10 * index,
          }}
        />
      );
    });

    return (
      <View
        style={{
          flexDirection: "row",
          width: 60,
          margin: 0,
        }}
      >
        {pfpArr}
      </View>
    );
  };
  const cardPressHandler =
    role === "player"
      ? (assignment) => {
          if (assignment.completed) {
            router.push({
              pathname: `content/assignments/attempts/${assignment.attemptId}`,
              params: {
                id: assignment.drillId,
              },
            });
          } else {
            router.push({
              pathname: `content/drill`,
              params: {
                id: `${assignment.drillId}`,
                assignedTime: assignment.assignedTime,
                currentTime: new Date(),
              },
            });
          }
        }
      : (assignment) => {
          setPlayerList(assignment["players"]);
          router.push({
            pathname: "content/assignments/players",
            params: {
              drillId: assignment.drillId,
            },
          });
        };
  return (
    <PaperWrapper>
      <SafeAreaView style={{ flex: 1 }} edges={["right", "top", "left"]}>
        <Header title="Assigned Drills" />
        <SectionList
          sections={sortedDates.map((date) => ({
            title: date,
            data: groupedData[date],
          }))}
          keyExtractor={(item) => `${item.assignedTime}-${item.drillId}`}
          renderItem={({ item: assignment }) => (
            <TouchableOpacity
              key={`${assignment.assignedTime}-${assignment.drillId}`}
              onPress={() => cardPressHandler(assignment)}
            >
              <AssignmentCard
                mainText={drillInfo[assignment.drillId]["subType"]}
                subText={drillInfo[assignment.drillId]["drillType"]}
                // subText={assignment.assignedTime}
                completed={assignment.completed}
                pfp={
                  role === "player" ? null : stackedPfp(assignment["players"])
                }
              />
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
      </SafeAreaView>
    </PaperWrapper>
  );
}
