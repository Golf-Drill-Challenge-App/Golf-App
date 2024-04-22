import { StyleSheet, View } from "react-native";
import { Icon, Text, TextInput } from "react-native-paper";
import { themeColors } from "~/Constants";

export default function DrillInput({
  icon,
  prompt,
  helperText,
  distanceMeasure,
  inputValue,
  onInputChange,
  currentShot,
  displayedShot,
}) {
  return (
    <View style={styles.item}>
      <Text style={styles.description}>
        <Icon source={icon} size={20} />
        {prompt}
      </Text>

      <View style={styles.horizontalContainer}>
        <TextInput
          mode="outlined"
          placeholder=""
          value={inputValue}
          keyboardType="numeric"
          returnKeyType="done"
          editable={currentShot === displayedShot}
          onChangeText={onInputChange}
          selectionColor={themeColors.accent}
          cursorColor={themeColors.accent}
          activeOutlineColor={themeColors.border}
        />
        <Text style={styles.distance}>{distanceMeasure}</Text>
      </View>
      <Text style={styles.helper}>{helperText}</Text>
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
