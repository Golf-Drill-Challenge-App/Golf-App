import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import ScatterChart from "react-native-scatter-chart";
import { themeColors } from "~/Constants";
import { numTrunc } from "~/Utility";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import ShotAccordion from "~/components/shotAccordion";
import { useAttempts } from "~/hooks/useAttempts";
import { useDrillInfo } from "~/hooks/useDrillInfo";
import { themeColors } from "../Constants";

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
  } = useDrillInfo(drillId);

  let attempt;

  if (attemptId) {
    const {
      data: usedAttempt,
      isLoading: attemptIsLoading,
      error: attemptError,
    } = useAttempts({ attemptId });

    attempt = usedAttempt;

    if (drillInfoIsLoading || attemptIsLoading) {
      return <Loading />;
    }

    if (drillInfoError || attemptError) {
      return <ErrorComponent message={[drillInfoError, attemptError]} />;
    }
  } else {
    attempt = attemptData;
  }

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
      alignItems: "center",
    };
    if (idx !== Object.keys(drillInfo["aggOutputs"]).length - 1) {
      styles.borderColor = "#ddd";
      styles.borderBottomWidth = 1;
    }
    return styles;
  }

  let title = {
    carryDiffAverage: "Carry Difference Average",
    proxHoleAverage: "Proximity-to-hole Average",
    sideLandingAverage: "Side Landing Average",
    sideLandingTotal: "Side Landing Total",
    strokesGained: "Strokes Gained",
    strokesGainedAverage: "Strokes Gained Average",
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Aggregate Data</Text>
        <View
          style={{
            margin: 10,
            backgroundColor: "#f5f5f5",
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 8,
          }}
        >
          {Object.keys(drillInfo["aggOutputs"]).map((output, idx) => (
            <View style={getStyle(idx)} key={output}>
              <Text>{title[output]}</Text>
              <Text>{numTrunc(attempt[output])}</Text>
            </View>
          ))}
        </View>

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
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
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
