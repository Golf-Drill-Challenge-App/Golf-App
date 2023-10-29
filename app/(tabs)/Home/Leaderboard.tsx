import { FlatList, StyleSheet } from "react-native";
import { View } from "../../../components/Themed";
import LeaderboardListItem from "../../../components/LeaderboardListItem";
import ScreenHeader from "../../../components/ScreenHeader";

type LeaderboardInfo = {
  name: string;
  score: number;
};

const testData: LeaderboardInfo[] = [
  { name: "Test", score: 12 },
  { name: "Test", score: 12 },
  { name: "Test", score: 12 },
  { name: "Test", score: 12 },
  { name: "Test", score: 12 },
  { name: "Test", score: 12 },
  { name: "Test", score: 12 },
  { name: "Test", score: 12 },
  { name: "Test", score: 12 },
  { name: "Test", score: 12 },
];

export default function Leaderboard() {
  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Leaderboard"
        imageUri={require("../../../assets/images/leaderboardHeader.png")}
      />
      <FlatList
        style={styles.list}
        showsVerticalScrollIndicator={false}
        data={testData}
        renderItem={({ item }) => (
          <LeaderboardListItem name={item.name} score={item.score} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    width: "90%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 8,
    height: 1,
  },
});
