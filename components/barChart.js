import {router, useLocalSearchParams} from "expo-router";
import {StatusBar} from 'expo-status-bar';
import {Button, ScrollView, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {BarChart, Grid, YAxis} from "react-native-svg-charts";
import {Path} from "react-native-svg";
import React, {useMemo, useRef, useState} from "react";
import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import {clampNumber, formatDate, numTrunc} from "~/Utility";
import DropDownPicker from "react-native-dropdown-picker";

import drillData from "~/drill_data.json"
import ShotAccordion from "~/components/shotAccordion";

export default function BarChartScreen(props) {
    const slug = useLocalSearchParams()["id"];
    const drillDataSorted = props.drillData.sort((a, b) => a.time - b.time)
    const data = drillDataSorted.map(value => value[props.mainOutputAttempt])

    const [_, setScrollPosition] = useState(0)
    const [movingAvgRange, setMovingAvgRange] = useState(5)
    const [movingAvgRangeValues] = useState([
        {label: "3", value: 3},
        {label: "5", value: 5},
        {label: "10", value: 10},
        {label: "15", value: 15},
    ])
    const [movingAvgRangeDropdownOpen, setMovingAvgRangeDropdownOpen] = useState(false)

    const {width} = useWindowDimensions()
    const fill = 'rgb(134, 65, 244)'
    const [selected, setSelected] = useState(0)
    const scrollViewRef = useRef();

    const dateString = formatDate(drillDataSorted[selected]["time"])

    const barWidth = 50

    const halfScreenCompensation = width / 2 - barWidth / 2
    const chartWidth = halfScreenCompensation * 2 + data.length * barWidth
    const chartHeight = 200

    const selectedBar = (scrollPosition) => {
        return clampNumber(Math.floor((scrollPosition + barWidth / 2) / barWidth), 0, data.length - 1)
    }

    const processedData = useMemo(() => {
        return data.map((value, index) => ({
            value: value,
            index: index,
            pass: (index + 1) >= movingAvgRange,
            movingAvg: (index + 1) >= movingAvgRange ? data.slice(index - movingAvgRange + 1, index + 1).reduce((a, b) => a + b, 0) / movingAvgRange : null,
            slice: data.slice(index - movingAvgRange + 1, index + 1),
            reduce: data.slice(index - movingAvgRange + 1, index + 1).reduce((a, b) => a + b, 0),
            svg: {
                fill: value > 0 ? 'green' : 'red',
            },
        }))
    }, [data, movingAvgRange, barWidth])

    const transparentData = data.map((value, index) => ({
        value: value > 0 ? Math.max(...data) : Math.min(...data),
        svg: {
            fill: 'transparent',
            onPress: () => {
                setSelected(index)
                scrollViewRef.current.scrollTo({x: index * barWidth, animated: true})
            },
        },
    }))

    const movingAvgData = data.map(
        (value, index) => (
            (index + 1) >= movingAvgRange ? data.slice(index - movingAvgRange + 1, index + 1).reduce((a, b) => a + b, 0) / movingAvgRange : 0))

    // Calculate scales
    const scaleY = scale.scaleLinear()
        .domain([Math.min(...data), Math.max(...data)]) // Adjust scale based on your data
        .range([chartHeight, 0]);

    const line = shape.line()
        .x((_, index) => halfScreenCompensation + barWidth / 2 + index * ((chartWidth - 2 * halfScreenCompensation) / movingAvgData.length))
        .y(d => scaleY(d))(movingAvgData)

    const handleScroll = function (event) {
        setScrollPosition(event.nativeEvent.contentOffset.x);
        setSelected(selectedBar(event.nativeEvent.contentOffset.x))
    }

    const MovingAvgPath = function MovingAvgPath({line}) {
        return (
            <Path
                d={line}
                stroke={'rgba(134, 65, 244, 1)'}
                fill={'none'}
                strokeWidth={2}
            />)
    };

    return (
        <>
            <Text>Open up App.js to start working on your app!asef</Text>
            <Button title={"Back"} onPress={() => router.back()}/>
            <View style={{zIndex: 3}}>
                <Text>Moving Avg.</Text>
                <DropDownPicker
                    setValue={setMovingAvgRange}
                    value={movingAvgRange}
                    items={movingAvgRangeValues}
                    open={movingAvgRangeDropdownOpen}
                    setOpen={setMovingAvgRangeDropdownOpen}
                    containerStyle={{
                        width: 300,
                    }}
                    style={{
                        width: 300
                    }}/>
            </View>
            <View style={{
                marginTop: 20,
                marginBottom: 20
            }}>
                <YAxis
                    data={data}
                    svg={{
                        fill: 'grey',
                        fontSize: 10,
                    }}
                    // numberOfTicks={10}
                    style={StyleSheet.create({
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        height: chartHeight,
                        zIndex: 1,
                        backgroundColor: 'white'
                    })}
                />
                <View //middle select line
                    style={{
                        position: 'absolute',
                        left: (width / 2) - 1, // Adjust this to place the line in the middle
                        top: 0,
                        bottom: 0,
                        width: 1,
                        zIndex: 2,
                        backgroundColor: 'black', // Choose a color that stands out
                    }}
                />
                <ScrollView
                    horizontal={true}
                    // contentContainerStyle={{width: 2000}}
                    onScroll={handleScroll}
                    scrollEventThrottle={64}
                    ref={scrollViewRef}
                >
                    <View
                        style={{
                            width: chartWidth,
                            height: chartHeight,
                        }}>
                        <BarChart
                            style={{
                                height: chartHeight,
                                width: chartWidth,
                                position: 'absolute',
                                top: 0,
                                left: 0,
                            }}
                            data={processedData}
                            svg={{fill}}
                            contentInset={{left: halfScreenCompensation, right: halfScreenCompensation}}
                            yAccessor={({item}) => item.value}
                            pointerEvents={'none'}
                        >
                            <Grid
                                pointerEvents={'none'}/>
                            <MovingAvgPath
                                line={line}
                                pointerEvents={'none'}
                                style={{pointerEvents: 'none'}}
                            />
                        </BarChart>
                        <BarChart
                            style={{
                                height: chartHeight,
                                width: chartWidth,
                                position: 'absolute',
                                top: 0,
                                left: 0,
                            }}
                            data={transparentData}
                            svg={{fill}}
                            contentInset={{left: halfScreenCompensation, right: halfScreenCompensation}}
                            yAccessor={({item}) => item.value}
                        ></BarChart>
                    </View>
                </ScrollView>
            </View>
            <View style={{
                flexDirection: "row",
                justifyContent: 'space-between',
            }}>
                <Text>{dateString}</Text>
                <Text>MA: {numTrunc(movingAvgData[selected])}</Text>
                <Text>SG: {numTrunc(data[selected])}</Text>
            </View>

            <ScrollView>
                {drillDataSorted[selected]["shots"].map(
                    (shot) =>
                        <ShotAccordion key={shot["sid"]} shot={shot} drill={drillData["drills"][slug]} total={drillDataSorted[selected]["shots"].length}/>
                )}
            </ScrollView>
            <StatusBar style="auto"/>
        </>
    );
}