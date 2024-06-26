import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function DrillTarget({ prompt, distanceMeasure, target }) {
  return (
    <View style={styles.item}>
      <Text style={styles.description}>{prompt}</Text>
      <Text style={styles.target}>
        {target} {distanceMeasure}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  item: {
    marginBottom: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  description: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  target: {
    fontSize: 40,
    fontWeight: "200",
    textAlign: "center",
  },
});
