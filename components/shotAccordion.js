import { View } from "react-native";
import { List, Text } from "react-native-paper";
import { numTrunc } from "~/Utility";

function Row({ name, value }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Text>{name}</Text>
      <Text>{value}</Text>
    </View>
  );
}

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
            <Row name={"(Actual)"} value={numTrunc(value["carry"])} />
            <Row name={"(Target)"} value={numTrunc(value["target"])} />
            <Row name={"(Diff)"} value={numTrunc(value["carryDiff"])} />
          </View>
        </View>
      );
    case "sideLanding":
    case "proxHole": //has units
      return (
        <Row key={field} name={title[field]} value={`${numTrunc(value)} ft`} />
      );
    case "strokesGained": //just round to 3 decimals
      return <Row key={field} name={title[field]} value={numTrunc(value)} />;
    default:
      return (
        <Row
          key={field}
          name={field in title ? title[field] : field}
          value={value}
        />
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
          case "strokesGained":
          case "carryDiff":
            return null;
          default:
            return DataField(field, props.shot[field]);
        }
      })}
    </List.Accordion>
  );
}

export default ShotAccordion;
