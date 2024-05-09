import * as scale from "d3-scale";
import * as shape from "d3-shape";
import { useEffect, useMemo, useRef, useState } from "react";
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

import { Button } from "react-native-paper";
import { themeColors } from "~/Constants";
import RefreshInvalidate from "~/components/refreshInvalidate";
import ShotAccordion from "~/components/shotAccordion";
import { currentAuthContext } from "~/context/Auth";
import { removeAttempt } from "~/hooks/removeAttempt";
import EmptyScreen from "./emptyScreen";

export default function BarChartScreen({
  drillData,
  drillInfo,
  invalidateKeys,
}) {
  if (drillData.length === 0) {
    return (
      <EmptyScreen
        invalidateKeys={invalidateKeys}
        text={"No attempts have been made yet."}
      />
    );
  }

  const scrollViewRef = useRef();

  const [page, setPage] = useState(0);

  const { currentTeamId } = currentAuthContext();

  useEffect(() => {
    scrollViewRef.current.scrollToEnd({ animated: false });
  }, [page]);

  const sortedDrillData = useMemo(
    () => drillData.sort((a, b) => a.time - b.time),
    [drillData],
  );

  const itemsPerPage = 300;

  const endIndex = sortedDrillData.length - page * itemsPerPage;
  const startIndex = Math.max(endIndex - itemsPerPage, 0);
  const totalPages = Math.ceil(sortedDrillData.length / itemsPerPage);

  const slicedDrillData = sortedDrillData.slice(startIndex, endIndex);

  const data = slicedDrillData.map((value) => {
    if (isNaN(value[drillInfo["mainOutputAttempt"]])) {
      //the terminator
      removeAttempt({ currentTeamId, attemptId: value["id"] }).then(() => {
        console.log(
          "terminated attempt: ",
          value["id"],
          " due to illegal value",
        );
      });
      return 0;
    }
    return value[drillInfo["mainOutputAttempt"]];
  });

  const yMin = Math.min(...data, 0); //For when minimum data is larger than 0
  const yMax = Math.max(...data, 0); //For when maximum data is smaller than 0, like when every input is negative

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
  const [selected, setSelected] = useState(0);

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

  const processedData = data.map((value, index) => ({
    value: value,
    index: index,
    svg: {
      fill: value > 0 ? "green" : "red",
    },
  }));

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
    .domain([yMin, yMax]) // Adjust scale based on your data
    .range([chartHeight - 5, 0]);

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
    setSelected(selectedBar(event.nativeEvent.contentOffset.x));
  };

  const shotAccordionList = useMemo(
    () =>
      sortedDrillData[selected]["shots"].map((shot) => (
        <ShotAccordion
          key={shot["sid"]}
          shot={shot}
          drillInfo={drillInfo}
          total={sortedDrillData[selected]["shots"].length}
        />
      )),
    [sortedDrillData, drillInfo, selected],
  );

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
      borderColor: themeColors.border,
    },
    dropdown: {
      width: "100%",
      backgroundColor: themeColors.highlight,
      // borderColor: themeColors.border, I can't find out how to change the drop down border, so let's just make it all black border here.
      borderWidth: 1,
      borderRadius: 4,
      paddingHorizontal: 10,
    },
    yAxis: {
      position: "absolute",
      top: 0,
      width: 35,
      bottom: 0,
      left: 0,
      height: chartHeight,
      zIndex: 5,
      backgroundColor: themeColors.background, // Set background color
      paddingHorizontal: 5, // Add padding
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
    <ScrollView
      refreshControl={<RefreshInvalidate invalidateKeys={invalidateKeys} />}
    >
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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <Text>{formatDate(sortedDrillData[startIndex]["time"])}</Text>
        <Text>to</Text>
        <Text>{formatDate(sortedDrillData[endIndex - 1]["time"])}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
        }}
      >
        <Button
          onPress={() => {
            setPage(page + 1);
          }}
          disabled={page === totalPages - 1}
          style={{ flexGrow: 1 }}
          textColor={themeColors.accent}
          compact
          rippleColor={"rgba(200,200,200,0.25)"}
          //Previous attempts chronologically
        >
          {"<Prev"}
        </Button>
        <Button
          onPress={() => {
            setPage(page - 1);
          }}
          disabled={page === 0}
          style={{ flexGrow: 1 }}
          textColor={themeColors.accent}
          compact
          rippleColor={"rgba(200,200,200,0.25)"}
          //Next attempts chronologically
        >
          {"Next>"}
        </Button>
      </View>

      <View style={styles.chartSection}>
        <YAxis
          data={data}
          style={styles.yAxis}
          formatLabel={(value) => `${value}`} // Format label as needed
          numberOfTicks={7}
          min={yMin}
          max={yMax}
          contentInset={{ bottom: 5, top: 6 }}
        />
        <View style={styles.middleLine} />
        <ScrollView
          ref={scrollViewRef}
          horizontal={true}
          onScroll={handleScroll}
          scrollEventThrottle={128}
          style={styles.scrollViewContainer}
          removeClippedSubviews={true}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: false })
          }
        >
          <View style={styles.chartContainer}>
            <BarChart
              style={styles.barChart}
              data={processedData}
              svg={{ fill: "rgb(134, 65, 244)" }}
              contentInset={{
                left: halfScreenCompensation,
                right: halfScreenCompensation,
                bottom: 5,
                top: 6,
              }}
              yAccessor={({ item }) => item.value}
              pointerEvents={"none"}
              key={page} //force barchart to re-render
              numberOfTicks={7}
              yMin={yMin}
              yMax={yMax}
            >
              <Grid />
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
            {formatDate(sortedDrillData[selected]["time"])}
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

        {shotAccordionList}
      </View>
    </ScrollView>
  );
}

const MovingAvgPath = ({ line }) => {
  return (
    <Path
      d={line}
      stroke={"rgba(134, 65, 244, 1)"}
      fill={"none"}
      strokeWidth={2}
    />
  );
};
