import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Button, Icon } from "react-native-paper";
import ScatterChart from "react-native-scatter-chart";
import ShotAccordion from "~/components/shotAccordion";
import { numTrunc } from "~/Utility";

function Result(props) {
  const display = () => {
    switch (props.drill.drillType) {
      case "20 Shot Challenge":
        return (
          <>
            <Text style={styles.sectionTitle}>Drill Results</Text>

            <View style={styles.dataSection}>
              <Text style={styles.dataTitle}>Strokes Gained</Text>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Total: </Text>
                <Text style={styles.dataValue}>
                  {numTrunc(submission["strokesGained"])}
                </Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Average: </Text>
                <Text style={styles.dataValue}>
                  {numTrunc(submission["strokesGainedAverage"])}
                </Text>
              </View>
            </View>

            <View style={styles.dataSection}>
              <Text style={styles.dataTitle}>Average Differences</Text>
              <View style={styles.dataRow}>
                <Icon source={"arrow-up-down"} />
                <Text style={styles.dataValue}>
                  {numTrunc(submission["carryDiffAverage"])}
                </Text>
              </View>
              <View style={styles.dataRow}>
                <Icon source={"arrow-left-right"} />
                <Text style={styles.dataValue}>
                  {numTrunc(submission["sideLandingAverage"])}
                </Text>
              </View>
              <View style={styles.dataRow}>
                <Icon source={"flag"} />
                <Text style={styles.dataValue}>
                  {numTrunc(submission["proxHoleAverage"])}
                </Text>
              </View>
            </View>

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

            <ScrollView>
              {submission["shots"].map((shot) => (
                <ShotAccordion
                  key={shot["sid"]}
                  shot={shot}
                  drill={props.drill}
                  total={numTrunc(submission["shots"].length)}
                />
              ))}
            </ScrollView>
          </>);
      case "Line Test":
        return (<Text>Line Test Result</Text>);
      default:
        console.log("Results page not found")
        break;

    }
  }



  const submission = props.submission.outputData;

  const dots = submission["shots"].map((value, index) => [
    value["sideLanding"],
    value["carryDiff"],
  ]);
  const { width } = useWindowDimensions();

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>


        {display()}
      </ScrollView>
      <Button
        style={styles.restartButton}
        mode="contained"
        buttonColor="#F24E1E"
        textColor="white"
      >
        Restart Drill
        </Button>
    </>
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
    alignItems: "center",
  },
});
