import { StyleSheet, View } from "react-native";
import { List, Text } from "react-native-paper";
import { numTrunc } from "~/Utility";

function Row({ name, value }) {
  return (
    <View style={styles.rowContainer}>
      <Text style={styles.rowName}>{name}</Text>
      <Text style={styles.rowValue}>{value}</Text>
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
          <Text style={{ marginLeft: 11, fontWeight: "bold" }}>Carry</Text>
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
              <Text>{numTrunc(Number(value["carry"]))} yd</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text>(Target)</Text>
              <Text>{numTrunc(Number(value["target"]))} yd</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text>(Diff)</Text>
              <Text>{numTrunc(Number(value["carryDiff"]))} yd</Text>
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
          <Text>{numTrunc(Number(value))} ft</Text>
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
          <Text>{numTrunc(Number(value))}</Text>
        </View>
      );
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
              Shot: {props.shot["sid"] + 1}/
            </Text>
            {props.total}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Target:</Text>{" "}
            {props.shot["target"]} yd
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>SG:</Text>{" "}
            {numTrunc(Number(props.shot[props.drillInfo["mainOutputShot"]]))}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  boldText: {
    fontWeight: "bold",
  },
  rowContainer: {
    flexDirection: "row",
    fontSize: 8,
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  rowName: {
    fontWeight: "bold",
  },
  rowValue: {},
});

export default ShotAccordion;
