import React from 'react';
import {Button, ScrollView, Text, useWindowDimensions, View} from "react-native";
import ScatterChart from "react-native-scatter-chart";
import ShotAccordion from "~/components/shotAccordion";

function Result(props) {
    const dots = props.submission.shots.map((value, index) => ([value["sideLanding"], value["carryDiff"]]))
    const {width} = useWindowDimensions()
    return (
        <>
            <ScrollView>
                <Text>Results</Text>
                <View>
                    <Text>Strokes Gained</Text>
                    <View>
                        <View>
                            <Text>
                                Total
                            </Text>
                            <Text>
                                {props.submission["strokesGained"]}
                            </Text>
                        </View>
                        <View>
                            <Text>
                                Average
                            </Text>
                            <Text>
                                {props.submission["strokesGainedAverage"]}
                            </Text>
                        </View>
                    </View>
                </View>
                <View>
                    <Text>Average Differences</Text>
                    <View>
                        <Text>{props.submission["carryDiffAverage"]}</Text>
                        <Text>{props.submission["sideLandingAverage"]}</Text>
                        <Text>{props.submission["proxHoleAverage"]}</Text>
                    </View>
                </View>
                <View style={{
                    width: width,
                }}>
                    <Text>Shot Tendency</Text>
                    <ScatterChart
                        backgroundColor='#ffffff'
                        data={[
                            {
                                color: 'blue',
                                unit: '%',
                                values: dots
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
                {props.submission["shots"].map(
                    (shot) =>
                        <ShotAccordion key={shot["sid"]} shot={shot} total={
                            props.submission["shots"].length}/>
                )}
            </ScrollView>
            <Button title={"Restart"}/>
        </>
    );
}

export default Result;