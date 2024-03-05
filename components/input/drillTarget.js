import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function DrillTarget({ drillTitle, distanceMeasure, value }) {
  const getInstructionDisplay = (drill) => {
    switch (drill) {
      case "20 Shot Challenge":
        return "Target";
      case "Line Test":
        return "Club";
      default:
        return "Instruction";
    }
  };

  return (
    <View style={styles.item}>
      <Text style={styles.description}>
        {getInstructionDisplay(drillTitle)}
      </Text>
      <Text style={styles.target}>
        {value} {distanceMeasure}
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
