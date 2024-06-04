import { useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon, Text, TextInput } from "react-native-paper";
import { themeColors } from "~/Constants";
import { getIconByKey } from "~/Utility";

export default function DrillInput({
  input,
  inputValue,
  onInputChange,
  currentShot,
  displayedShot,
}) {
  const [checked, setChecked] = useState(false);

  return (
    <View style={styles.item}>
      <View
        style={{
          flexDirection: "row",
          left: -10,
        }}
      >
        <Icon
          source={getIconByKey(input.id)}
          size={20}
          style={{ position: "relative" }}
        />
        <Text style={styles.description}>{input.prompt}</Text>
      </View>

      <View style={styles.horizontalContainer}>
        {input.id !== "completed" ? (
          <TextInput
            mode="outlined"
            placeholder=""
            value={inputValue}
            keyboardType={
              Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"
            }
            returnKeyType="done"
            editable={currentShot === displayedShot}
            onChangeText={onInputChange}
            selectionColor={themeColors.accent}
            cursorColor={themeColors.accent}
            activeOutlineColor={themeColors.border}
          />
        ) : (
          <TouchableOpacity
            style={{}}
            activeOpacity={0.5}
            onPress={() => {
              setChecked(!checked);
              inputValue = !checked || "";
              onInputChange(inputValue);
            }}
          >
            <View
              style={{
                borderWidth: 1,
                borderRadius: 8,
                borderColor: "#aaa",
                width: 60,
                height: 60,
                backgroundColor: "#fff",
              }}
            >
              {checked ? (
                <Icon source="check" size={60} color="green" />
              ) : (
                <Icon source="check" size={60} color="#ddd" />
              )}
            </View>
          </TouchableOpacity>
        )}
        <Text style={styles.distance}>{input.distanceMeasure}</Text>
      </View>

      <Text style={styles.helper}>{input.helperText}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  item: {
    marginBottom: 30,
    alignItems: "center",
  },
  horizontalContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  description: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  distance: {
    fontSize: 40,
    fontWeight: "200",
    marginLeft: 10,
  },
  helper: {
    fontSize: 12,
    fontWeight: "200",
  },
});
