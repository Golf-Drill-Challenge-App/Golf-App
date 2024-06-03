import { useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon, Text, TextInput } from "react-native-paper";
import { themeColors } from "~/Constants";

export default function DrillInput({
  icon,
  input,
  inputValue,
  onInputChange,
  currentShot,
  displayedShot,
}) {
  const [checked, setChecked] = useState(false);

  return (
    <View style={styles.item}>
      {input.id !== "completed" ? (
        <>
          <Text style={styles.description}>
            <Icon source={icon} size={20} />
            {input.prompt}
          </Text>

          <View style={styles.horizontalContainer}>
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

            <Text style={styles.distance}>{input.distanceMeasure}</Text>
          </View>
        </>
      ) : (
        <View style={styles.horizontalContainer}>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: themeColors.border,
              borderRadius: 8,
              marginVertical: 5,
              paddingHorizontal: 20,
              padding: 10,
              backgroundColor: "#fff",
            }}
            activeOpacity={0.5}
            onPress={() => {
              setChecked(!checked);
              inputValue = !checked || "";
              onInputChange(inputValue);
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                <Text style={{ fontSize: 24, color: "#333" }}>
                  {input.prompt}{" "}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {checked ? (
                  <Icon source="checkbox-outline" size={24} />
                ) : (
                  <Icon source="checkbox-blank-outline" size={24} />
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}
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
