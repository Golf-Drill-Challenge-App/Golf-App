import { router, usePathname } from "expo-router";
import { useMemo } from "react";
import { SectionList, TouchableOpacity, View } from "react-native";
import { Avatar, Text } from "react-native-paper";
import { themeColors } from "~/Constants";
import { formatDate } from "~/Utility";
import ProfilePicture from "~/components/ProfilePicture";
import AssignmentCard from "~/components/assignmentCard";
import EmptyScreen from "~/components/emptyScreen";
import RefreshInvalidate from "~/components/refreshInvalidate";

const AssignmentsList = ({
  role,
  playerInfo,
  userInfo,
  invalidateKeys,
  drillInfo,
  children,
  disableCriteria = () => false,
}) => {
  const today = formatDate(Date.now());

  const currentPath = usePathname();

  const assigned_data = useMemo(() => {
    if (userInfo) {
      return userInfo.assigned_data;
    } else {
      const alreadyAddedData = {};
      const newAssignedData = [];

      Object.values(playerInfo).forEach((player) => {
        player["assigned_data"].forEach((assignment) => {
          const { assignedTime, drillId, completed, attemptId } = assignment;
          const { uid, pfp, name } = player;

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
            name,
            uid,
            completed,
            attemptId,
          });
        });
      });

      Object.values(alreadyAddedData).forEach((assignedSortedByTime) => {
        Object.values(assignedSortedByTime).forEach(
          (assignedSortedByDrillId) => {
            newAssignedData.push(assignedSortedByDrillId);
          },
        );
      });
      return newAssignedData;
    }
  }, [playerInfo, userInfo]);

  // Group the assigned drills by date
  const groupedData = useMemo(() => {
    return assigned_data.reduce((acc, curr) => {
      const assignedDate = new Date(curr.assignedTime);
      const timezoneOffset = assignedDate.getTimezoneOffset() * 60000;
      const localTime = curr.assignedTime - timezoneOffset;
      //round the assigned time to the nearest day
      const roundedTime = Math.floor(localTime / 86400000) * 86400000 + timezoneOffset;

      if (!acc[roundedTime]) {
        acc[roundedTime] = [];
      }
      if (curr.completed) {
        acc[roundedTime].push(curr);
      } else {
        acc[roundedTime].unshift(curr);
      }

      return acc;
    }, {});
  }, [assigned_data]);

  // Sort the dates in descending order
  const sortedDates = useMemo(() => {
    return Object.keys(groupedData).sort(
      (a, b) => new Date(Number(b)) - new Date(Number(a)),
    );
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
    const numLeft = playerList.length - numPfp;

    const pfpArr = playerList.slice(0, numPfp).map((player, index) => {
      return (
        <ProfilePicture
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            position: "relative",
            left: -5 * index,
          }}
          userInfo={player}
          key={player.uid}
        />
      );
    });

    if (numLeft > 0) {
      pfpArr.push(
        <Avatar.Text
          size={24}
          label={`+${numLeft}`}
          color="white"
          style={{
            backgroundColor: themeColors.avatar,
            position: "relative",
            left: -15,
            borderWidth: 0.2,
            borderColor: "grey",
          }}
          key="numLeft"
        />,
      );
    }

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: 85,
          position: "relative",
          left: -10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: 55,
            margin: 0,
          }}
        >
          {pfpArr}
        </View>
      </View>
    );
  };

  const cardPressHandler = (assignment) => {
    if (userInfo) {
      if (assignment.completed) {
        router.push({
          pathname: `${currentPath}/attempts/${assignment.attemptId}`,
          params: {
            id: assignment.drillId,
          },
        });
      } else if (role === "player") {
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
      renderItem={({ item: assignment }) => {
        const disabled = disableCriteria(
          !!assignment.completed || !!assignment.hasStats,
        );
        return (
          <TouchableOpacity
            key={`${assignment.assignedTime}-${assignment.drillId}`}
            onPress={() => cardPressHandler(assignment)}
            disabled={disabled}
          >
            <AssignmentCard
              mainText={drillInfo[assignment.drillId]["subType"]}
              subText={drillInfo[assignment.drillId]["drillType"]}
              completed={assignment.completed}
              pfp={userInfo ? null : stackedPfp(assignment["players"])}
              disabled={disabled}
            />
          </TouchableOpacity>
        );
      }}
      renderSectionHeader={({ section: { title } }) => {
        const date = formatDate(title);
        return (
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              textAlign: "left",
              marginLeft: 20,
              paddingVertical: 5,
              backgroundColor: themeColors.background,
            }}
          >
            {date === today ? "Today" : date}
          </Text>
        );
      }}
      refreshControl={
        // handle updating cache for another user list of drills
        <RefreshInvalidate invalidateKeys={invalidateKeys} />
      }
    />
  );
};

export default AssignmentsList;
