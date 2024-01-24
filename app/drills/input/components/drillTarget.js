import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import React from "react";

export default function DrillTarget({ description, distanceMeasure, value }) {
  return (
    <View style={styles.item}>
      <Text>{description}</Text>
      <Text>
        {value} {distanceMeasure}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  item: {
    marginBottom: 20,
  },
  horizontalContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
