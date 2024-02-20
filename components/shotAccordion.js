import React from "react";
import { List, Text } from "react-native-paper";
import { View } from "react-native";
import { numTrunc } from "~/Utility";

function DataField(field, value) {
  let title = {
    target: "Target",
    sideLanding: "Side Landing",
    proxHole: "Proximity to hole",
    baseline: "Baseline SG",
    expectedPutts: "Expected putts",
  };
  switch (field) {
    case "carry": //compound
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          key={field}
        >
          <Text>Carry</Text>
          <View
            style={{
              width: 200,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text>(Actual)</Text>
              <Text>{numTrunc(value["carry"])} yd</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text>(Target)</Text>
              <Text>{numTrunc(value["target"])} yd</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text>(Diff)</Text>
              <Text>{numTrunc(value["carryDiff"])} yd</Text>
            </View>
          </View>
        </View>
      );
    case "sideLanding":
    case "proxHole": //has units
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
          key={field}
        >
          <Text>{title[field]}</Text>
          <Text>{numTrunc(value)} ft</Text>
        </View>
      );
    case "strokesGained": //just round to 3 decimals
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
          key={field}
        >
          <Text>{title[field]}</Text>
          <Text>{numTrunc(value)}</Text>
        </View>
      );
    default:
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
          key={field}
        >
          <Text>{field in title ? title[field] : field}</Text>
          <Text>{value}</Text>
        </View>
      );
  }
}

function ShotAccordion(props) {
  return (
    <List.Accordion
      title={
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignSelf: "stretch",
          }}
        >
          <Text>
            <Text style={{ fontWeight: "bold" }}>
              Shot: {props.shot["sid"]}/
            </Text>
            {props.total}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Target:</Text>{" "}
            {props.shot["target"]} yd
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>SG:</Text>{" "}
            {numTrunc(props.shot[props.drillInfo["mainOutputShot"]])}
          </Text>
        </View>
      }
      style={{
        backgroundColor: "#fff",
        borderWidth: 1,
        borderStyle: "solid",
      }}
    >
      {props.drillInfo["outputs"].map((field) => {
        switch (field) {
          case "carry":
            return DataField(field, {
              carry: props.shot["carry"],
              target: props.shot["target"],
              carryDiff: props.shot["carryDiff"],
            });
          default:
            return DataField(field, props.shot[field]);
        }
      })}
    </List.Accordion>
  );
}

export default ShotAccordion;
