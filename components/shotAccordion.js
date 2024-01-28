import React from 'react';
import {List, Text} from "react-native-paper";
import {View} from "react-native";
import {numTrunc} from "~/Utility";

function ShotAccordion(props) {
    return (
        <List.Accordion
            title={
                <View style={{
                    flexDirection: "row",
                    justifyContent: 'space-between',
                    alignSelf: 'stretch',
                }}>
                    <Text><Text style={{fontWeight: "bold"}}>Shot: {props.shot["sid"]}/</Text>{props.total}</Text>
                    <Text><Text style={{fontWeight: "bold"}}>Target:</Text> {props.shot["target"]} yd</Text>
                    <Text><Text style={{fontWeight: "bold"}}>SG:</Text> {numTrunc(props.shot["strokesGained"])}</Text>
                </View>
            }
            style={{
                backgroundColor: "#fff",
                borderWidth: 1,
                borderStyle: 'solid'
            }}>
            <View style={{
                flexDirection: "row",
                justifyContent: 'space-between',
            }}>
                <Text>
                    Proximity to hole
                </Text>
                <Text>
                    {numTrunc(props.shot["proxHole"])} ft
                </Text>
            </View>
            <View style={{
                flexDirection: "row",
                justifyContent: 'space-between',
            }}>
                <Text>
                    Baseline SG
                </Text>
                <Text>
                    {numTrunc(props.shot["baseline"])}
                </Text>
            </View>
            <View style={{
                flexDirection: "row",
                justifyContent: 'space-between',
            }}>
                <Text>
                    Expected putts
                </Text>
                <Text>
                    {props.shot["expectedPutts"]}
                </Text>
            </View>

            <View style={{
                flexDirection: "row",
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <Text>
                    Carry
                </Text>
                <View style={{
                    width: 200
                }}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: 'space-between',
                    }}>
                        <Text>
                            (Actual)
                        </Text>
                            <Text>
                                {numTrunc(props.shot["carry"])} yd
                            </Text>
                    </View>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: 'space-between',
                    }}>
                        <Text>
                            (Target)
                        </Text>
                        <Text>
                            {numTrunc(props.shot["target"])} yd
                        </Text>
                    </View>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: 'space-between',
                    }}>
                        <Text>
                            (Diff)
                        </Text>
                        <Text>
                            {numTrunc(props.shot["carryDiff"])} yd
                        </Text>
                    </View>
                </View>
            </View>

            <View style={{
                flexDirection: "row",
                justifyContent: 'space-between',
            }}>
                <Text>
                    Side Landing
                </Text>
                <Text>
                    {numTrunc(props.shot["sideLanding"])} ft
                </Text>
            </View>
        </List.Accordion>
    );
}

export default ShotAccordion;