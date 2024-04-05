import { useLocalSearchParams, useNavigation } from "expo-router";
import { StyleSheet } from "react-native";
import { Appbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import ResultScreen from "../../../../../components/resultScreen";

export default function Result() {
  const drillId = useLocalSearchParams()["id"];
  const attemptId = useLocalSearchParams()["attempt"];
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["right", "top", "left"]}>
      <Appbar.Header style={{ backgroundColor: "FFF" }} statusBarHeight={0}>
        <Appbar.BackAction onPress={navigation.goBack} color={"#F24E1E"} />
        <Appbar.Content title="Drill Results" titleStyle={styles.title} />
      </Appbar.Header>
      <ResultScreen drillId={drillId} attemptId={attemptId} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
