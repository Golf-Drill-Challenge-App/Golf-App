import { router } from "expo-router";
import { useMemo } from "react";
import { SectionList, TouchableOpacity, View } from "react-native";
import { Image } from "react-native-expo-image-cache";
import { Text } from "react-native-paper";
import { themeColors } from "~/Constants";
import { formatDate } from "~/Utility";
import AssignmentCard from "~/components/assignmentCard";
import EmptyScreen from "~/components/emptyScreen";
import RefreshInvalidate from "~/components/refreshInvalidate";

const AssignmentsList = ({
  userId,
  playerInfo,
  userInfo,
  invalidateKeys,
  drillInfo,
  children,
}) => {
  const today = formatDate(Date.now());

  let assigned_data = userId ? userInfo.assigned_data : [];

  if (!userId) {
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
  const groupedData = useMemo(() => {
    return assigned_data.reduce((acc, curr) => {
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
  }, [assigned_data, today]);

  // Sort the dates in descending order
  const sortedDates = useMemo(() => {
    return Object.keys(groupedData).sort((a, b) => new Date(b) - new Date(a));
  }, [groupedData]);

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

  const cardPressHandler = (assignment) => {
    if (userId) {
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
    } else {
      router.push({
        pathname: "content/assignments/players",
        params: {
          drillId: assignment.drillId,
          assignedTime: assignment.assignedTime,
        },
      });
    }
  };

  return (
    <SectionList
      sections={sortedDates.map((date) => ({
        title: date,
        data: groupedData[date],
      }))}
      keyExtractor={(item) => `${item.assignedTime}-${item.drillId}`}
      ListHeaderComponent={children}
      renderItem={({ item: assignment }) => (
        <TouchableOpacity
          key={`${assignment.assignedTime}-${assignment.drillId}`}
          onPress={() => cardPressHandler(assignment)}
        >
          <AssignmentCard
            mainText={drillInfo[assignment.drillId]["subType"]}
            subText={drillInfo[assignment.drillId]["drillType"]}
            completed={assignment.completed}
            pfp={userId ? null : stackedPfp(assignment["players"])}
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
      refreshControl={
        // handle updating cache for another user list of drills
        <RefreshInvalidate invalidateKeys={invalidateKeys} />
      }
    />
  );
};

export default AssignmentsList;
