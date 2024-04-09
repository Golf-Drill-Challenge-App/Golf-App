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
    <View
      style={{
        marginLeft: 11,
        marginRight: 11,
        marginBottom: 9,
      }}
    >
      <List.Accordion
        theme={{
          colors: {
            background: "#f5f5f5",
          },
        }}
        title={
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Text style={{ width: "30%", paddingRight: 2 }}>
              <Text style={styles.boldText}>Shot: {props.shot["sid"] + 1}/</Text>
              {props.total}
            </Text>
            <Text style={{ width: "40%", textAlign: "center", padding: 2 }}>
              <Text style={styles.boldText}>Target:</Text>{" "}
              {props.shot["target"]} yd
            </Text>
            <Text style={{ width: "30%", textAlign: "right", paddingLeft: 2 }}>
              <Text style={styles.boldText}>SG:</Text>{" "}
              {numTrunc(props.shot[props.drillInfo["mainOutputShot"]])}
            </Text>
          </View>
        }
        style={{
          backgroundColor: "#f5f5f5",
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 8,
        }}
      >
        <View
          style={{
            backgroundColor: "#f5f5f5",
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
        </View>
      </List.Accordion>
    </View>
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
