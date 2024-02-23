import React from "react";
import { List, Text } from "react-native-paper";
import { View, StyleSheet } from "react-native";
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
// }
// function DataField(field, value) {
//   let title = {
//     target: "Target",
//     sideLanding: "Side Landing",
//     proxHole: "Proximity to hole",
//     baseline: "Baseline SG",
//     expectedPutts: "Expected putts",
//   };
//   switch (field) {
//     case "carry": //compound
//       return (
//         <View style={styles.fieldContainer} key={field}>
//           <Text style={styles.fieldTitle}>Carry</Text>
//           <View style={styles.fieldValuesContainer}>
//             <View style={styles.fieldValueRow}>
//               <Text>(Actual)</Text>
//               <Text>{numTrunc(value["carry"])} yd</Text>
//             </View>
//             <View style={styles.fieldValueRow}>
//               <Text>(Target)</Text>
//               <Text>{numTrunc(value["target"])} yd</Text>
//             </View>
//             <View style={styles.fieldValueRow}>
//               <Text>(Diff)</Text>
//               <Text>{numTrunc(value["carryDiff"])} yd</Text>
//             </View>
//           </View>
//         </View>
//       );
//     case "sideLanding":
//     case "proxHole": //has units
//     case "strokesGained": //just round to 3 decimals
//       return (
//         <View style={styles.fieldContainer} key={field}>
//           <Text style={styles.fieldTitle}>{title[field]}</Text>
//           <Text>
//             {numTrunc(value)} {field === "sideLanding" ? "ft" : ""}
//           </Text>
//         </View>
//       );
//     default:
//       return (
//         <View style={styles.fieldContainer} key={field}>
//           <Text style={styles.fieldTitle}>
//             {field in title ? title[field] : field}
//           </Text>
//           <Text>{value}</Text>
//         </View>
//       );
//   }
// }

function ShotAccordion(props) {
  return (
    <View style = {{backgroundColor: "#f5f5f5", paddingLeft: 11, paddingRight: 11, paddingBottom: 9}}>
      <List.Accordion
        title={
          <View style={styles.titleContainer}>
            <Text>
              <Text style={styles.boldText}>Shot: {props.shot["sid"]}/</Text>
              {props.total}
            </Text>
            <Text>
              <Text style={styles.boldText}>Target:</Text>{" "}
              {props.shot["target"]} yd
            </Text>
            <Text>
              <Text style={styles.boldText}>SG:</Text>{" "}
              {numTrunc(props.shot[props.drill["mainOutputShot"]])}
            </Text>
          </View>
        }
        style={styles.container}
        contentStyle={styles.content}
      >
        {props.drill["outputs"].map((field) =>
          DataField(field, props.shot[field]),
        )}
      </List.Accordion>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8
  },
  content: {
    marginLeft: 0,
    marginRight: 0,
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
});

export default ShotAccordion;
