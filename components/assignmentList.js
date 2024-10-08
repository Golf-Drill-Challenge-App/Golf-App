import { router, usePathname } from "expo-router";
import { useCallback, useMemo } from "react";
import { SectionList, TouchableOpacity, View } from "react-native";
import { Avatar, Text } from "react-native-paper";
import { debounce } from "underscore";
import { themeColors } from "~/Constants";
import { formatDate } from "~/Utility";
import ProfilePicture from "~/components/ProfilePicture";
import AssignmentCard from "~/components/assignmentCard";
import EmptyScreen from "~/components/emptyScreen";
import RefreshInvalidate from "~/components/refreshInvalidate";
import { useTimeContext } from "~/context/Time";

const AssignmentsList = ({
  role,
  singleUser,
  playerInfo,
  invalidateKeys,
  drillInfo,
  children,
  disableCriteria = () => false,
}) => {
  const currentPath = usePathname();

  const { getLocalizedDate, getCurrentLocalizedDate } = useTimeContext();

  const assigned_data = useMemo(() => {
    const alreadyAddedData = {};
    const newAssignedData = [];

    Object.values(playerInfo).forEach((player) => {
      player["assigned_data"].forEach((assignment) => {
        const { assignedTime, drillId, completed, attemptId } = assignment;
        const { uid, pfp, name } = player;
        const mergeTime = getLocalizedDate({
          time: assignedTime,
          rounded: true,
        }).getTime();

        if (!alreadyAddedData[mergeTime]) {
          alreadyAddedData[mergeTime] = {};
        }

        if (!alreadyAddedData[mergeTime][drillId]) {
          alreadyAddedData[mergeTime][drillId] = {
            assignedTime,
            mergeTime,
            drillId,
            players: [],
          };
        }

        alreadyAddedData[mergeTime][drillId].players.push({
          pfp,
          name,
          uid,
          completed,
          attemptId,
        });
      });
    });

    Object.values(alreadyAddedData).forEach((assignedSortedByTime) => {
      Object.values(assignedSortedByTime).forEach((assignedSortedByDrillId) => {
        newAssignedData.push(assignedSortedByDrillId);
      });
    });
    return newAssignedData;
  }, [getLocalizedDate, playerInfo]);

  // Group the assigned drills by date
  const groupedData = useMemo(() => {
    return assigned_data.reduce((acc, curr) => {
      const time = curr.mergeTime;

      if (!acc[time]) {
        acc[time] = [];
      }
      if (curr.completed) {
        acc[time].push(curr);
      } else {
        acc[time].unshift(curr);
      }

      return acc;
    }, {});
  }, [assigned_data]);

  // Sort the dates in descending order
  const sortedDates = useMemo(() => {
    return Object.keys(groupedData).sort((a, b) => b - a);
  }, [groupedData]);

  const cardPressHandler = useCallback(
    debounce(
      (assignment) => {
        if (singleUser) {
          //since singleUser
          if (assignment["players"][0].completed) {
            router.push({
              pathname: `${currentPath}/attempts/${assignment["players"][0].attemptId}`,
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
          } //else disabled
        } else {
          router.push({
            pathname: "content/assignments/players",
            params: {
              drillId: assignment.drillId,
              mergeTime: assignment.mergeTime,
            },
          });
        }
      },
      1000,
      true,
    ),
    [singleUser],
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

  return (
    <SectionList
      sections={sortedDates.map((date) => ({
        title: date,
        data: groupedData[date],
      }))}
      keyExtractor={(item) => `${item.mergeTime}-${item.drillId}`}
      ListHeaderComponent={children}
      renderItem={({ item: assignment }) => {
        const assignmentCompleted = singleUser
          ? assignment["players"][0].completed
          : false;
        const disabled = disableCriteria({
          completed: assignmentCompleted,
          hasStats: drillInfo[assignment.drillId].hasStats,
        });
        return (
          <TouchableOpacity
            key={`${assignment.mergeTime}-${assignment.drillId}`}
            onPress={() => cardPressHandler(assignment)}
            disabled={disabled}
          >
            <AssignmentCard
              mainText={drillInfo[assignment.drillId]["subType"]}
              subText={drillInfo[assignment.drillId]["drillType"]}
              completed={assignmentCompleted}
              pfp={singleUser ? null : stackedPfp(assignment["players"])}
              disabled={disabled}
            />
          </TouchableOpacity>
        );
      }}
      renderSectionHeader={({ section: { title } }) => {
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
            {title == getCurrentLocalizedDate({ rounded: true }).getTime()
              ? "Today"
              : formatDate(title)}
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
