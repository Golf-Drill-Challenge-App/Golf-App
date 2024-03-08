import { StyleSheet, View } from "react-native";
import { Icon, Text, TextInput } from "react-native-paper";

export default function DrillInput({
  icon,
  prompt,
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
        />
        <Text style={styles.distance}>{distanceMeasure}</Text>
      </View>
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
    fontWeight: "bold", //temporary until I get the fonts to work
    marginBottom: 10,
  },
  distance: {
    fontSize: 40,
    fontWeight: "200", //temporary until I get the fonts to work
    marginLeft: 10,
  },
});
