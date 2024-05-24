import { useEffect } from "react";
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
  useEffect(() => {
    console.log("rendering ResultScreen for: ", attemptId);
  });
  const { width } = useWindowDimensions();
  let displayShotTendency = false;

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

  drillInfo.outputs.map((output) => {
    if (output === "carry" || output === "sideLanding") {
      displayShotTendency = true;
    }
  });

  if (drillInfoIsLoading || attemptIsLoading) {
    return <Loading />;
  }

  if (drillInfoError || attemptError) {
    return <ErrorComponent errorList={[drillInfoError, attemptError]} />;
  }

  let attempt = attemptId ? fetchedAttempt : attemptData;

  let dots = attempt["shots"].map((value) => [
    value["sideLanding"] ? value["sideLanding"] : 0,
    value["carryDiff"] ? value["carryDiff"] : 0,
  ]);

  let yValues = dots.map((value) => value[1]);
  let yMax = Math.max(...yValues, 10) + 10;
  yMax += 0.1 * yMax;
  let yMin = Math.min(...yValues, -10) - 10;
  yMin += 0.1 * yMin;

  let xValues = dots.map((value) => value[0]);
  let xMax = Math.max(...xValues, 10);
  xMax += 0.1 * xMax;
  let xMin = Math.min(...xValues, -10);
  xMin += 0.1 * xMin;

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
        <Text style={[styles.sectionTitle, { marginTop: 10 }]}>
          Aggregate Data
        </Text>
        <View
          style={{
            backgroundColor: themeColors.highlight,
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

        {displayShotTendency && (
          <>
            <Text style={styles.sectionTitle}>Shot Tendency</Text>
            <View style={styles.chartSection}>
              <View style={{ width: width * 0.9 }}>
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
                  minY={yMin}
                  maxY={yMax}
                  minX={xMin}
                  maxX={xMax}
                  chartWidth={width * 0.9}
                />
              </View>
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>Shot History</Text>
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
  container: {
    paddingBottom: 0,
    marginLeft: 11,
    marginRight: 11,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 30,
  },
  chartSection: {
    alignItems: "center",
  },
  chart: {
    backgroundColor: "#ffffff",
  },
});
