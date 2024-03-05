import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function DrillTarget({ distanceMeasure, value }) {
  return (
    <View style={styles.item}>
      <Text style={styles.description}>Target</Text>
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
  fontTest: {
    fontFamily: "Inter-Regular",
  },
  description: {
    fontSize: 20,
    fontWeight: "bold", //temporary until I get the fonts to work
    textAlign: "center",
  },
  target: {
    fontSize: 40,
    fontWeight: "200", //temporary until I get the fonts to work
    textAlign: "center",
  },
});
