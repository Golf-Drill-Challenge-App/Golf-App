import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import ScatterChart from "react-native-scatter-chart";
import { prettyTitle, themeColors } from "~/Constants";
import { numTrunc } from "~/Utility";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import ShotAccordion from "~/components/shotAccordion";
import { useAttempts } from "~/hooks/useAttempts";
import { useDrillInfo } from "~/hooks/useDrillInfo";

export default function ResultScreen({
  drillId = null,
  attemptId = null,
  attemptData = null,
}) {
  const { width } = useWindowDimensions();
  const {
    data: drillInfo,
    isLoading: drillInfoIsLoading,
    error: drillInfoError,
  } = useDrillInfo({ drillId });

  const {
    data: fetchedAttempt,
    isLoading: attemptIsLoading,
    error: attemptError,
  } = useAttempts({ attemptId, enabled: !!attemptId });

  if (drillInfoIsLoading || attemptIsLoading) {
    return <Loading />;
  }

  if (drillInfoError || attemptError) {
    return <ErrorComponent message={[drillInfoError, attemptError]} />;
  }

  let attempt = attemptId ? fetchedAttempt : attemptData;

  console.log(
    "attempt",
    attempt,
    "fetchedAttempt",
    fetchedAttempt,
    "attemptData",
    attemptData,
    "attemptId",
    attemptId,
    "drillInfo",
    drillInfo,
  );

  let dots = [];
  if (
    drillInfo["outputs"].includes("sideLanding") &&
    drillInfo["outputs"].includes("carryDiff")
  ) {
    dots = attempt["shots"].map((value) => [
      value["sideLanding"],
      value["carryDiff"],
    ]);
  }

  function getStyle(idx) {
    let styles = {
      paddingVertical: 8,
      paddingHorizontal: 10,
      flexDirection: "row",
      justifyContent: "space-between",
    };
    if (idx !== Object.keys(drillInfo["aggOutputs"]).length - 1) {
      styles.borderColor = themeColors.border;
      styles.borderBottomWidth = 1;
    }
    return styles;
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Aggregate Data</Text>
        <View
          style={{
            margin: 10,
            backgroundColor: "#f5f5f5",
            borderWidth: 1,
            borderColor: themeColors.border,
            borderRadius: 8,
          }}
        >
          {Object.keys(drillInfo["aggOutputs"]).map((output, idx) => (
            <View style={getStyle(idx)} key={output}>
              <Text>{prettyTitle[output]}</Text>
              <Text>
                {numTrunc(attempt[output])}{" "}
                {drillInfo.aggOutputs[output].distanceMeasure}
              </Text>
            </View>
          ))}
        </View>

        {dots.length > 0 && (
          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>Shot Tendency</Text>
            <View style={{ ...styles.chartContainer, width: width * 0.8 }}>
              <ScatterChart
                style={styles.chart}
                backgroundColor={themeColors.highlight}
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
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  container: {
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
    backgroundColor: themeColors.background,
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
