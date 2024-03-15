import { StyleSheet, View } from "react-native";
import { Icon, Text } from "react-native-paper";

import { getIconByKey } from "~/Utility";

export default function NavigationRectangle({
  drillInfo,
  attemptShots,
  inputValues,
  shotIndex,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <Text>
          Shot {shotIndex}/{attemptShots.length}
        </Text>
        <Text>
          Target: {attemptShots[shotIndex - 1].target}
          {drillInfo.requirements[0].distanceMeasure}
        </Text>
      </View>
      <View style={styles.rowContainer}>
        {drillInfo.inputs.map((item, id) => (
          <View style={styles.horizontalContainer} key={id}>
            <Icon source={getIconByKey(item.id)} />
            <Text>
              {inputValues[item.id]} {item.distanceMeasure}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#d9d9d9",
    padding: 20,
    borderRadius: 10,
    maxHeight: 250,
    width: "80%",
    overflow: "hidden",
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
  },
  horizontalContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
