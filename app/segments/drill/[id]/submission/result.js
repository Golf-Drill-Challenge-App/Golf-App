import { useLocalSearchParams, useNavigation } from "expo-router";
import { StyleSheet } from "react-native";
import { Appbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import ResultScreen from "~/components/resultScreen";
import { getCombinedDrillTitle } from "~/Utility";

function Result(props) {
  const submission = props.submission;
  const navigation = useNavigation();
  const drillId = useLocalSearchParams()["id"];

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["right", "top", "left"]}>
      <Appbar.Header statusBarHeight={0} style={{ backgroundColor: "FFF" }}>
        <Appbar.Action
          icon="close"
          onPress={navigation.goBack}
          color={"#F24E1E"}
        />
        <Appbar.Content title={getCombinedDrillTitle(props.drill)} />
      </Appbar.Header>
      <ResultScreen drillId={drillId} attemptData={submission} />
    </SafeAreaView>
  );
}

export default Result;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "center",
  },
  dataSection: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    width: "60%",
    alignSelf: "center",
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },

  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },

  dataLabel: {
    fontSize: 14,
  },

  dataValue: {
    fontSize: 14,
    fontWeight: "bold",
  },

  chartSection: {
    marginBottom: 30,
    alignItems: "center",
  },
  chartContainer: {},
  chart: {
    backgroundColor: "#ffffff",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignSelf: "center",
    height: 350,
  },

  restartButton: {
    margin: 10,
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
  },
});
