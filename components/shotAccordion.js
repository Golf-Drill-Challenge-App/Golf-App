import { StyleSheet, View } from "react-native";
import { Icon, List, Text } from "react-native-paper";
import { prettyTitle, shortTitle, themeColors } from "~/Constants";
import { numTrunc } from "~/Utility";

function Row({ name, value }) {
  return (
    <View style={styles.rowContainer}>
      <Text style={styles.rowName}>{name}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function DataField(drillInfo, field, value) {
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
          <Text style={{ fontWeight: "bold" }}>Carry</Text>
          <View
            style={{
              width: 150,
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
        <Row
          key={field}
          name={prettyTitle[field]}
          value={`${numTrunc(value)} yd`}
        />
      );
    case "distance":
      return (
        <Row
          key={field}
          name={prettyTitle[field]}
          value={`${numTrunc(value)} ft`}
        />
      );
    case "sideLanding":
      return (
        <Row
          key={field}
          name={prettyTitle[field]}
          value={`${numTrunc(value)} yd`}
        />
      );
    case "proxHole": //has units
      return (
        <Row
          key={field}
          name={prettyTitle[field]}
          value={`${numTrunc(value)} ft`}
        />
      );
    case "strokesGained": //just round to 3 decimals
      return (
        <Row key={field} name={prettyTitle[field]} value={numTrunc(value)} />
      );
    case "strokes": //just round to 3 decimals
      return <Row key={field} name={prettyTitle[field]} value={value} />;
    case "break": //just round to 3 decimals
      return <Row key={field} name={prettyTitle[field]} value={value} />;
    default:
      return (
        <Row
          key={field}
          name={field in prettyTitle ? prettyTitle[field] : field}
          value={value}
        />
      );
  }
}

function ShotAccordion(props) {
  return (
    <View
      style={{
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
        rippleColor={"rgba(221,221,221,0.25)"}
        left={() => (
          <View
            style={{
              width: "90%",
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                flex: 1,
                flexGrow: 1,
                marginRight: 10,
              }}
            >
              <Text style={styles.boldText}>Shot: </Text>
              <Text>
                <Text style={styles.boldText}>{props.shot["sid"]}</Text>/
                {props.total}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                flex: 1,
                flexGrow: 1.5,
              }}
            >
              <Text style={styles.boldText}>
                {prettyTitle[props.drillInfo.requirements[0].name]}:{" "}
              </Text>
              <Text>
                {props.shot[props.drillInfo.requirements[0].name]}{" "}
                {props.drillInfo.requirements[0].distanceMeasure}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                flex: 1,
                flexGrow: 1,
                marginLeft: 10,
              }}
            >
              <Text style={styles.boldText}>
                {shortTitle[props.drillInfo["mainOutputShot"]]}:{" "}
              </Text>
              <Text>
                {numTrunc(props.shot[props.drillInfo["mainOutputShot"]])}
              </Text>
            </View>
          </View>
        )}
        right={({ isExpanded }) => (
          <View
            style={{
              position: "relative",
              left: -20,
            }}
          >
            <Icon
              source={isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
            />
          </View>
        )}
        style={{
          backgroundColor: themeColors.highlight,
          borderWidth: 1,
          borderColor: themeColors.border,
          borderRadius: 8,
        }}
      >
        <View
          style={{
            backgroundColor: themeColors.background,
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          {props.drillInfo["outputs"].map((field) => {
            switch (field) {
              case "carry":
                return DataField(props.drillInfo, field, {
                  carry: props.shot["carry"],
                  target: props.shot["target"],
                  carryDiff: props.shot["carryDiff"],
                });
              case "carryDiff":
                return null;
              default:
                switch (props.drillInfo.requirements[0].type) {
                  case "inputtedPutt":
                    return DataField(props.drillInfo, field, props.shot[field]);
                  default:
                    return DataField(props.drillInfo, field, props.shot[field]);
                }
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
