import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Icon } from "react-native-paper";
import ScatterChart from "react-native-scatter-chart";
import { BarChart, Grid } from "react-native-svg-charts";
import { prettyTitle, themeColors } from "~/Constants";
import { numTrunc } from "~/Utility";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import RefreshInvalidate from "~/components/refreshInvalidate";
import ShotAccordion from "~/components/shotAccordion";
import { useAttempts } from "~/dbOperations/hooks/useAttempts";
import { useDrillInfo } from "~/dbOperations/hooks/useDrillInfo";

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

  const invalidateKeys = [
    ["drillInfo", { drillId }],
    ["attempts", { attemptId }],
  ];

  if (drillInfoIsLoading || attemptIsLoading) {
    return <Loading />;
  }

  if (drillInfoError || attemptError) {
    return <ErrorComponent errorList={[drillInfoError, attemptError]} />;
  }

  const attempt = attemptId ? fetchedAttempt : attemptData;

  const displayShotTendency = drillInfo.outputs.some(
    (output) => output === "carry" || output === "sideLanding",
  );

  const dots = attempt["shots"].map((value) => [
    (value["sideLanding"] ? Number(value["sideLanding"]) : 0) + 0.0612,
    (value["carry"] ? Number(value["carry"]) : 0) + 0.2,
  ]);

  const yValues = dots.map((value) => value[1]);
  let yMax = Math.max(...yValues, 10) + 10;
  yMax += 0.1 * yMax;
  let yMin = Math.min(...yValues, -10) - 10;
  yMin += 0.1 * yMin;

  const xValues = dots.map((value) => value[0]);
  let xMax = Math.max(...xValues, 20);
  xMax += 0.1 * xMax;
  let xMin = Math.min(...xValues, -20);
  xMin += 0.1 * xMin;

  const displayStrokeCount = drillInfo.outputs.some(
    (output) => output === "strokes",
  );

  const temp = attempt.shots.reduce((acc, { strokes }) => {
    acc[strokes] = acc[strokes] || { value: 0, label: strokes };
    acc[strokes].value += 1;
    return acc;
  }, {});

  const barData = Object.values(temp);

  const barWidth = 25;
  const chartHeight = barData.length * barWidth;

  const Labels = ({ x, y, bandwidth, data }) => {
    const textArray = data.map((item, index) => {
      const value = item.value;
      return (
        <Text
          key={index}
          style={{
            position: "absolute",
            top: y(index) + bandwidth / 2 - 9,
            left: x(value) + 5,
          }}
          fontSize={14}
          fill={"black"}
          zIndex={0}
        >
          {value}
        </Text>
      );
    });
    return <View>{textArray}</View>;
  };

  const sortedAggOutputs = Object.keys(drillInfo.aggOutputs).sort((a, b) => {
    return prettyTitle[a].localeCompare(prettyTitle[b]);
  });

  function getStyle(idx) {
    const styles = {
      paddingVertical: 8,
      paddingHorizontal: 10,
      flexDirection: "row",
      justifyContent: "space-between",
    };
    if (idx !== sortedAggOutputs.length - 1) {
      styles.borderColor = themeColors.border;
      styles.borderBottomWidth = 1;
    }
    return styles;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        // handle updating cache for another user list of drills
        <RefreshInvalidate invalidateKeys={invalidateKeys} />
      }
    >
      {drillInfo.requirements[0].type !== "text" ? (
        <>
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
            {sortedAggOutputs.map((output, idx) => (
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
                    horizontalLinesAt={[0, 50, 100, 150, 200, 250]}
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
          {displayStrokeCount && (
            <View style={{}}>
              <Text style={styles.sectionTitle}>Stroke Count</Text>
              <View
                style={{
                  flexDirection: "row",
                  height: chartHeight,
                  width: width * 0.9,
                  margin: "auto", //center the chart
                }}
              >
                {/*YAxis*/}
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: chartHeight,
                  }}
                >
                  {barData.map((item, index) => (
                    <Text
                      key={index}
                      style={{
                        position: "absolute",
                        top: index * barWidth + barWidth / 2 - 8,
                        left: 0,
                        fontSize: 14,
                        fill: "black",
                        zIndex: 0,
                      }}
                    >
                      {item.label}
                    </Text>
                  ))}
                </View>
                <BarChart
                  style={{
                    height: chartHeight,
                    width: "100%",
                  }}
                  data={barData}
                  horizontal={true}
                  yAccessor={({ item }) => item.value}
                  svg={{ fill: "green", zIndex: 1 }}
                  contentInset={{ right: 25, left: 25 }}
                  spacing={0.2}
                  gridMin={0}
                >
                  <Grid direction={Grid.Direction.VERTICAL} />
                  <Labels />
                </BarChart>
              </View>
            </View>
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
        </>
      ) : (
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            marginVertical: 150,
          }}
        >
          <Text
            style={{
              alignSelf: "center",
              fontSize: 26,
              fontWeight: "bold",
              padding: 20,
            }}
          >
            Drill Submitted!
          </Text>
          <Icon source="check" size={100} color="green" />
        </View>
      )}
    </ScrollView>
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
