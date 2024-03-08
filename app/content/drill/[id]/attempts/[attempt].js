import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScatterChart from "react-native-scatter-chart";
import { numTrunc } from "~/Utility";
import ShotAccordion from "~/components/shotAccordion";
import db from "~/firebaseConfig";

function Result() {
  const drillId = useLocalSearchParams()["id"];
  const attemptId = useLocalSearchParams()["attempt"];
  const [drillInfo, setDrillInfo] = useState({});
  const [attempt, setAttempt] = useState({});

  let dots = [];
  if (
    Object.keys(drillInfo).length > 0 &&
    Object.keys(attempt).length > 0 &&
    drillInfo["outputs"].includes("sideLanding") &&
    drillInfo["outputs"].includes("carryDiff")
  ) {
    dots = attempt["shots"].map((value, index) => [
      value["sideLanding"],
      value["carryDiff"],
    ]);
  }
  const { width } = useWindowDimensions();
  useEffect(() => {
    // massive data fetching on refresh. May or may not get its data from cache
    let mainOutputAttempt = "";
    getDoc(doc(db, "teams", "1", "drills", drillId)).then((doc) => {
      // get drill data
      if (doc.exists()) {
        setDrillInfo(doc.data());
        console.log("got drill data", mainOutputAttempt);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    });
    getDoc(doc(db, "teams", "1", "attempts", attemptId))
      .then((doc) => {
        setAttempt(doc.data());
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
    return () => {};
  }, []);

  return (
    <>
      <SafeAreaView style={{ flex: 1 }} edges={["right", "top", "left"]}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.sectionTitle}>Drill Results</Text>

          {Object.keys(drillInfo).length > 0 &&
            drillInfo["aggOutputs"].map((output) => (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                key={output}
              >
                <Text>{output}</Text>
                <Text>{numTrunc(attempt[output])}</Text>
              </View>
            ))}

          {dots.length > 0 && (
            <View style={styles.chartSection}>
              <Text style={styles.sectionTitle}>Shot Tendency</Text>
              <View style={{ ...styles.chartContainer, width: width * 0.8 }}>
                <ScatterChart
                  style={styles.chart}
                  backgroundColor="#ffffff"
                  data={[
                    {
                      color: "blue",
                      unit: "%",
                      values: dots,
                    },
                  ]}
                  horizontalLinesAt={[0]}
                  verticalLinesAt={[0]}
                  minY={-10}
                  maxY={10}
                  minX={-35}
                  maxX={35}
                  chartWidth={width * 0.8}
                />
              </View>
            </View>
          )}

          {attempt["shots"] &&
            attempt["shots"].map((shot) => (
              <ShotAccordion
                key={shot["sid"]}
                shot={shot}
                drillInfo={drillInfo}
                total={numTrunc(attempt["shots"].length)}
              />
            ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

export default Result;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 0,
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
    alignItems: "center",
  },
});
