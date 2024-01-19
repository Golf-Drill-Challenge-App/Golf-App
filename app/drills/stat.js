import {StatusBar} from 'expo-status-bar';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import {BarChart, Grid, YAxis} from "react-native-svg-charts";
import {Path} from "react-native-svg";
import {memo, useEffect, useMemo, useRef, useState} from "react";
import {useWindowDimensions} from 'react-native';
import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import {clampNumber} from "../../Utility";

const data = [-2,4,-3,-3,-8,9,-10,1,-6,4,-8,3,-3,6,10,-5,-8,-8,-5,4,5,-8,5,-7,-8,7,-7,8,1,1,6,10,-10,-8,2,2,-7,3,-3,10,9,0,-5,-8,-7,4,-6,2,-4,3,-7,8,7,-10,-9,2,-10,-8,-7,-4,-4,0,-4,-2,-8,-10,9,-5,-4,10,8,-6,-9,1,-7,-8,5,-7,9,-10,-5,-7,6,0,-3,6,-2,-6,5,-3,-1,6,-9,-1,10,6,-1,-5,-4,8]

export default function Stat() {
    const [scrollPosition, setScrollPosition] = useState(0)
    const [movingAvgRange, setMovingAvgRange] = useState(5)
    const {width} = useWindowDimensions()
    const fill = 'rgb(134, 65, 244)'
    const [selected, setSelected] = useState(data.length - 1)
    const scrollViewRef = useRef();
    const [selector1, setSelector1] = useState("1")

    const barWidth = 50

    const halfScreenCompensation = width / 2 - barWidth / 2
    const chartWidth = halfScreenCompensation * 2 + data.length * barWidth
    const chartHeight = 200

    const selectedBar = (scrollPosition) => {
        return clampNumber(Math.floor((scrollPosition + barWidth / 2) / barWidth), 0, data.length - 1)
    }

    const processedData = useMemo(()=> {
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
        value: value,
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

    console.log(processedData)

    // Calculate scales
    const scaleY = scale.scaleLinear()
        .domain([Math.min(...data), Math.max(...data)]) // Adjust scale based on your data
        .range([chartHeight, 0]);

    const line = shape.line()
        .x((_, index) => halfScreenCompensation + barWidth/2 + index * ((chartWidth - 2*halfScreenCompensation) / movingAvgData.length))
        .y(d => scaleY(d))(movingAvgData)

    const handleScroll = function(event) {
        setScrollPosition(event.nativeEvent.contentOffset.x);
        setSelected(selectedBar(event.nativeEvent.contentOffset.x))
    }

    const MovingAvgPath = function MovingAvgPath({ line }){
        return(
            <Path
                d={line}
                stroke={'rgba(134, 65, 244, 1)'}
                fill={'none'}
                strokeWidth={2}
            />)
    };

    return (
        <SafeAreaView>
            <Text>Open up App.js to start working on your app!asef</Text>
            <View>
                <YAxis
                    data={data}
                    contentInset={{top: 30, bottom: 30}}
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
                <View
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
                            contentInset={{top: 30, bottom: 30, left: halfScreenCompensation, right: halfScreenCompensation}}
                            yAccessor={({ item }) => item.value}
                            pointerEvents={'none'}
                        >
                            <Grid
                                pointerEvents={'none'}/>
                            <MovingAvgPath
                                line={line}
                                pointerEvents={'none'}
                                style={{ pointerEvents: 'none' }}
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
                            contentInset={{top: 30, bottom: 30, left: halfScreenCompensation, right: halfScreenCompensation}}
                            yAccessor={({ item }) => item.value}
                        ></BarChart>
                    </View>
                </ScrollView>
            </View>
            <Text>Moving Avg Range: {movingAvgRange}</Text>
            <Text>Scroll Position: {scrollPosition}</Text>
            <Text>Last Clicked: {selected}</Text>
            <Text>Slice: {JSON.stringify(processedData[selected]["slice"])}</Text>
            <Text>Reduce: {processedData[selected]["reduce"]}</Text>
            <Text>Moving Average: {processedData[selected]["movingAvg"]}</Text>
            <StatusBar style="auto"/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
