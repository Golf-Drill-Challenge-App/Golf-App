import React from 'react';
import {View, Text} from "react-native";

function DrillCard(props) {
    return (
        <View  style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",

            borderWidth: 1,
            borderStyle: 'solid'
        }}>
            <Text>{props.drill["drillType"]}</Text>
            <View style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'flex-end',
            }}>
                <Text>{props.drill["spec"]}</Text>
                <Text>{props.drill["inputs"].map((input) => {
                    let retVal = ""
                    switch (input){
                        case "distance":
                            retVal = "↑"
                            break
                        case "sideLanding":
                            retVal = "↔︎"
                            break
                        case "strokes":
                            retVal = "#"
                            break
                        default:
                            retVal = "?"
                    }
                    return retVal
                }).join(' ') + " x" + props.drill["reps"]}</Text>
            </View>
            <Text>></Text>
        </View>
    );
}

export default DrillCard;