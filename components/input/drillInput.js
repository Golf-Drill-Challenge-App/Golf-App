import { View, StyleSheet } from "react-native";
import React from "react";
import { Text, Icon, TextInput } from "react-native-paper";

export default function DrillInput({
  icon,
  prompt,
  distanceMeasure,
  inputValue,
  onInputChange,
}) {
  return (
    <View style={styles.item}>
      <Text>
        <Icon source={icon} />
        {prompt}
      </Text>

      <View style={styles.horizontalContainer}>
        <TextInput
          mode="outlined"
          placeholder="Type something"
          value={inputValue}
          keyboardType="numeric"
          returnKeyType="done"
          editable={true}
          onChangeText={onInputChange}
        />
        <Text>{distanceMeasure}</Text>
      </View>
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
