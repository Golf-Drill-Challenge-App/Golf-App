import React from "react";
import { View } from "react-native";
import { List, Text, Icon, Avatar } from "react-native-paper";

import { takeBestScore } from "~/Utility";
import drillsData from "~/drill_data.json";

export default function Leaderboard({ leaderboardData, drillId }) {
  const bestScores = takeBestScore(leaderboardData);
  const orderedLeaderboard = bestScores.sort((a, b) => a.score - b.score);

  const getUserInfo = (userId) => {
    return drillsData.teams["1"].users[userId];
  };

  return (
    <List.Section>
      {orderedLeaderboard.map((user) => (
        <List.Item
          key={user.user}
          title={getUserInfo(user.user).name}
          left={() => <Avatar.Text size={24} label="XD" />}
          right={() => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text>{user.score} ft</Text>
              <Icon source="chevron-right" />
            </View>
          )}
        />
      ))}
    </List.Section>
  );
}
