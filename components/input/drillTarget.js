import { useFonts } from "expo-font";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function DrillTarget({ distanceMeasure, value }) {
  const [fontsLoaded, fontError] = useFonts({
    "Inter-Regular": require("~/assets/fonts/Inter-Regular.ttf"),
    "Inter-Bold": require("~/assets/fonts/Inter-Bold.ttf"),
    "Inter-SemiBold": require("~/assets/fonts/Inter-SemiBold.ttf"),
    "IBMPlexMono-Regular": require("~/assets/fonts/IBMPlexMono-Regular.ttf"),
  });

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
