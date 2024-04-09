import { useQueryClient } from "@tanstack/react-query";
import * as scale from "d3-scale";
import * as shape from "d3-shape";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  RefreshControl,
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
import ShotAccordion from "~/components/shotAccordion";
import { currentAuthContext } from "../context/Auth";
import { removeAttempt } from "../hooks/removeAttempt";

export default function BarChartScreen({ drillData, drillInfo }) {
  if (drillData.length === 0) {
    return <Text>No attempts have been made yet.</Text>;
  }

  const queryClient = useQueryClient();

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    console.log("heeeere");
    console.log(drillData);
    setTimeout(() => {
      queryClient.invalidateQueries({
        // used predicate as it seemed to be the best method to invalidate multiple query keys
        predicate: (query) =>
          (query.queryKey[0] === "drillInfo" &&
            query.queryKey[1] === drillData[0].did) ||
          (query.queryKey[0] === "attempts" &&
            query.queryKey[1] === currentTeamId &&
            query.queryKey[2].userId === drillData[0].uid &&
            query.queryKey[2].drillId === drillData[0].did),
      });
      setRefreshing(false);
    }, 500);
  }, []);

  const scrollViewRef = useRef();

  const [page, setPage] = useState(0);

  const { currentUserId, currentTeamId } = currentAuthContext();

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

  const barWidth = 10; // temporary for android testing, remove before merge

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
    },
    dropdown: {
      width: "100%",
      backgroundColor: "#fafafa",
      borderColor: "#ccc",
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
      backgroundColor: "#F2F2F2", // Set background color
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
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
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
      <Text>
        {formatDate(sortedDrillData[startIndex]["time"])} -{" "}
        {formatDate(sortedDrillData[endIndex - 1]["time"])}
      </Text>
      <View>
        <Button
          onPress={() => {
            setPage(page + 1);
          }}
          disabled={page === totalPages - 1}
          //Previous attempts chronologically
        >
          Prev
        </Button>
        <Button
          onPress={() => {
            setPage(page - 1);
          }}
          disabled={page === 0}
          //Next attempts chronologically
        >
          Next
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
          contentInset={{ bottom: 5 }}
        />
        <View style={styles.middleLine} />
        <ScrollView
          ref={scrollViewRef}
          horizontal={true}
          onScroll={handleScroll}
          scrollEventThrottle={128}
          style={styles.scrollViewContainer}
          removeClippedSubviews={true}
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
