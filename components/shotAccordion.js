import { StyleSheet, View } from "react-native";
import { List, Text } from "react-native-paper";
import { themeColors } from "~/Constants";
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
    proxHole: "Proximity to Hole",
    baseline: "Baseline SG",
    expectedPutts: "Expected Putts",
    strokes: "Strokes",
    break: "Break",
    club: "Club",
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
            <Row name={"(Actual)"} value={`${numTrunc(value["carry"])} yd`} />
            <Row name={"(Target)"} value={`${numTrunc(value["target"])} yd`} />
            <Row name={"(Diff)"} value={`${numTrunc(value["carryDiff"])} yd`} />
          </View>
        </View>
      );
    case "target":
      return (
        <Row key={field} name={title[field]} value={`${numTrunc(value)} yd`} />
      );
    case "sideLanding":
      return (
        <Row key={field} name={title[field]} value={`${numTrunc(value)} yd`} />
      );
    case "proxHole": //has units
      return (
        <Row key={field} name={title[field]} value={`${numTrunc(value)} ft`} />
      );
    case "strokesGained": //just round to 3 decimals
      return <Row key={field} name={title[field]} value={numTrunc(value)} />;
    case "strokes": //just round to 3 decimals
      return <Row key={field} name={title[field]} value={value} />;
    case "break": //just round to 3 decimals
      return <Row key={field} name={title[field]} value={value} />;
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
            background: themeColors.background,
          },
        }}
        title={""}
        left={() => (
          <View
            style={{
              width: "90%",
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: 20,
            }}
          >
            <Text style={{ width: "30%" }}>
              <Text style={styles.boldText}>Shot: {props.shot["sid"]}/</Text>
              {props.total}
            </Text>
            <Text style={{ width: "40%" }}>
              <Text style={styles.boldText}>Target:</Text>{" "}
              {props.shot[props.drillInfo.requirements[0].name]}{" "}
              {props.drillInfo.requirements[0].distanceMeasure}
            </Text>
            <Text style={{ width: "30%" }}>
              <Text style={styles.boldText}>SG:</Text>{" "}
              {numTrunc(props.shot[props.drillInfo["mainOutputShot"]])}
            </Text>
          </View>
        )}
        style={{
          backgroundColor: themeColors.background,
          borderWidth: 1,
          borderColor: themeColors.border,
          borderRadius: 8,
        }}
      >
        <View
          style={{
            backgroundColor: themeColors.background,
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
              case "strokesTaken":
                return DataField(field, props.shot["strokes"]);
              case "break":
                return DataField(field, props.shot["break"]);
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
    backgroundColor: themeColors.background,
    borderWidth: 1,
    borderColor: themeColors.border,
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
    borderColor: themeColors.border,
  },
  rowName: {
    fontWeight: "bold",
  },
  rowValue: {},
});

export default ShotAccordion;
