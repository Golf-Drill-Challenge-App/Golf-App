import { StyleSheet } from "react-native";
import { Text, View } from "../../../components/Themed";
import { useLocalSearchParams } from "expo-router";
import ScreenHeader from "../../../components/ScreenHeader";

export default function Drill() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <ScreenHeader
        imageUri={require("../../../assets/images/drillsHeader.jpeg")}
        title="Title"
      />
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text style={styles.title}>{id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
