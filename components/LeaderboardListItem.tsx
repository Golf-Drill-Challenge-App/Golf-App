import { StyleSheet } from "react-native";
import { Pressable, Text } from "./Themed";

type Props = {
  name: string;
  score: number;
};

export default function LeaderboardListItem({ name, score }: Props) {
  return (
    <Pressable style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.score}>{score}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  name: {
    fontFamily: "Karma",
    fontWeight: "bold",
    fontSize: 24,
  },
  score: {
    fontSize: 20,
  },
});
