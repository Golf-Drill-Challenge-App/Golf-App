import * as scale from "d3-scale";
import * as shape from "d3-shape";
import { useMemo, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Path } from "react-native-svg";
import { BarChart, Grid, YAxis } from "react-native-svg-charts";
import { clampNumber, formatDate, numTrunc } from "~/Utility";

import ShotAccordion from "~/components/shotAccordion";

export default function BarChartScreen({ drillData, drillInfo }) {
  if (drillData.length === 0) {
    return <Text>No attempts have been made yet.</Text>;
  }
  const drillDataSorted = drillData.sort((a, b) => a.time - b.time);
  const data = drillDataSorted.map(
    (value) => value[drillInfo["mainOutputAttempt"]],
  );

  console.log("drillDataSorted", drillData);

  const [_, setScrollPosition] = useState(0);
  const [movingAvgRange, setMovingAvgRange] = useState(5);
  const [movingAvgRangeValues] = useState([
    { label: "3", value: 3 },
    { label: "5", value: 5 },
    { label: "10", value: 10 },
    { label: "15", value: 15 },
  ]);
  const [movingAvgRangeDropdownOpen, setMovingAvgRangeDropdownOpen] =
    useState(false);

  const { width } = useWindowDimensions();
  const fill = "rgb(134, 65, 244)";
  const [selected, setSelected] = useState(0);
  const scrollViewRef = useRef();

  const dateString = formatDate(drillDataSorted[selected]["time"]);

  const barWidth = 50;

  const halfScreenCompensation = width / 2 - barWidth / 2;
  const chartWidth = halfScreenCompensation * 2 + data.length * barWidth;
  const chartHeight = 200;

  const selectedBar = (scrollPosition) => {
    return clampNumber(
      Math.floor((scrollPosition + barWidth / 2) / barWidth),
      0,
      data.length - 1,
    );
  };

  const processedData = useMemo(() => {
    return data.map((value, index) => ({
      value: value,
      index: index,
      svg: {
        fill: value > 0 ? "green" : "red",
      },
    }));
  }, [data]);

  const movingAvgData = data.map((value, index) =>
    index + 1 >= movingAvgRange
      ? data
          .slice(index - movingAvgRange + 1, index + 1)
          .reduce((a, b) => a + b, 0) / movingAvgRange
      : 0,
  );

  // Calculate scales
  const scaleY = scale
    .scaleLinear()
    .domain([Math.min(...data), Math.max(...data)]) // Adjust scale based on your data
    .range([chartHeight, 0]);

  const line = shape
    .line()
    .x(
      (_, index) =>
        halfScreenCompensation +
        barWidth / 2 +
        index *
          ((chartWidth - 2 * halfScreenCompensation) / movingAvgData.length),
    )
    .y((d) => scaleY(d))(movingAvgData);

  const handleScroll = function (event) {
    setScrollPosition(event.nativeEvent.contentOffset.x);
    setSelected(selectedBar(event.nativeEvent.contentOffset.x));
  };

  const MovingAvgPath = function MovingAvgPath({ line }) {
    return (
      <Path
        d={line}
        stroke={"rgba(134, 65, 244, 1)"}
        fill={"none"}
        strokeWidth={2}
      />
    );
  };

  const styles = StyleSheet.create({
    movingAvgContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
      marginTop: 13,
      zIndex: 3,
      justifyContent: "center", // Center the content horizontally
    },
    movingAvgLabel: {
      fontSize: 18,
      fontWeight: "bold",
      marginRight: 10,
      marginTop: 4.5,
    },
    dropdownContainer: {
      width: 70,
      height: 45,
      zIndex: 3,
    },
    dropdown: {
      width: "100%",
      backgroundColor: "#fafafa",
      borderColor: "#ccc",
      borderWidth: 1,
      borderRadius: 4,
      paddingHorizontal: 10,
    },
    chartSection: {
      marginTop: 20,
      marginBottom: 20,
    },
    yAxis: {
      position: "absolute",
      top: 0,
      width: 35,
      bottom: 0,
      left: 0,
      height: chartHeight,
      zIndex: 5,
      backgroundColor: "#F4F4F4", // Set background color
      paddingHorizontal: 5, // Add padding
      borderRadius: 10, // Add border radius for rounded corners
    },
    middleLine: {
      position: "absolute",
      left: width / 2 - 1,
      top: 0,
      bottom: 0,
      width: 1,
      zIndex: 2,
      backgroundColor: "black",
    },
    scrollViewContainer: {
      flexDirection: "row",
    },
    chartContainer: {
      width: chartWidth,
      height: chartHeight,
    },
    barChart: {
      height: chartHeight,
      width: chartWidth,
      position: "absolute",
      top: 0,
      left: 0,
    },
    bottomContainer: {
      marginTop: 20,
      // marginBottom: 20,
    },
    bottomTextContainer: {
      flexDirection: "row",
      justifyContent: "flex-start",
      marginBottom: 13,
      marginLeft: 8,
      marginRight: 8,
    },
    bottomText: {
      fontSize: 13,
      color: "#333", // Adjust text color
    },
  });

  return (
    <ScrollView>
      <View style={styles.movingAvgContainer}>
        <Text style={styles.movingAvgLabel}>Moving Avg.</Text>

        <DropDownPicker
          setValue={setMovingAvgRange}
          value={movingAvgRange}
          items={movingAvgRangeValues}
          open={movingAvgRangeDropdownOpen}
          setOpen={setMovingAvgRangeDropdownOpen}
          containerStyle={styles.dropdownContainer}
          style={styles.dropdown}
        />
      </View>

      <View style={styles.chartSection}>
        <YAxis
          data={data}
          svg={{
            fill: "grey",
            fontSize: 12,
            stroke: "#666", // Set stroke color for grid lines
          }}
          style={styles.yAxis}
          contentInset={{ top: 10, bottom: 10 }} // Adjust content inset
          numberOfTicks={10} // Adjust number of ticks as needed
          formatLabel={(value) => `${value}`} // Format label as needed
        />
        <View style={styles.middleLine} />
        <ScrollView
          horizontal={true}
          onScroll={handleScroll}
          scrollEventThrottle={64}
          ref={scrollViewRef}
          style={styles.scrollViewContainer}
        >
          <View style={styles.chartContainer}>
            <BarChart
              style={styles.barChart}
              data={processedData}
              svg={{ fill }}
              contentInset={{
                left: halfScreenCompensation,
                right: halfScreenCompensation,
              }}
              yAccessor={({ item }) => item.value}
              pointerEvents={"none"}
            >
              <Grid pointerEvents={"none"} />
              <MovingAvgPath
                line={line}
                pointerEvents={"none"}
                style={{ pointerEvents: "none" }}
              />
            </BarChart>
          </View>
        </ScrollView>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.bottomTextContainer}>
          <Text style={{ ...styles.bottomText, width: "30%" }}>
            {dateString}
          </Text>
          <Text
            style={{ ...styles.bottomText, width: "40%", textAlign: "center" }}
          >
            MA: {numTrunc(movingAvgData[selected])}
          </Text>
          <Text
            style={{ ...styles.bottomText, width: "30%", textAlign: "right" }}
          >
            SG: {numTrunc(data[selected])}
          </Text>
        </View>

        {drillDataSorted[selected]["shots"].map((shot) => (
          <ShotAccordion
            key={shot["sid"]}
            shot={shot}
            drillInfo={drillInfo}
            total={drillDataSorted[selected]["shots"].length}
          />
        ))}
      </View>
    </ScrollView>
  );
}
