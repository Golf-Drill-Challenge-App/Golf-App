import { View } from "react-native";
import { Icon, Text } from "react-native-paper";

import { getIconByKey } from "~/Utility";

function requirementDisplay(attemptShots, drillInfo, shotIndex) {
  if (drillInfo.requirements[0].name == "target") {
    return (
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 16,
          padding: 2,
        }}
      >
        {drillInfo.requirements[0].prompt}:{" "}
        {attemptShots[shotIndex - 1].items.target}{" "}
        {drillInfo.requirements[0].distanceMeasure}
      </Text>
    );
  }
  if (drillInfo.requirements[0].name == "club") {
    return (
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 16,
          padding: 2,
        }}
      >
        {drillInfo.requirements[0].prompt}:{" "}
        {attemptShots[shotIndex - 1].items.club}
      </Text>
    );
  }
}

export default function NavigationRectangle({
  drillInfo,
  attemptShots,
  inputValues,
  shotIndex,
}) {
  return (
    <View
      style={{
        backgroundColor: "#d9d9d9",
        padding: 20,
        borderRadius: 10,
        maxHeight: 250,
        width: "80%",
        overflow: "hidden",
        marginBottom: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        elevation: 5,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 25,
            elevation: 5,
            textShadowColor: "rgba(0, 0, 0, 0.2)",
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 5,
          }}
        >
          Shot {shotIndex}/{attemptShots.length}
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            marginBottom: 10,
            borderBottomWidth: 2,
            borderColor: "#A0A0A0",
          }}
        >
          {requirementDisplay(attemptShots, drillInfo, shotIndex)}
        </View>

        <View
          style={{
            flexDirection: "row",
            marginBottom: 10,
            alignItems: "center",
          }}
        >
          {drillInfo.inputs.map((item, id) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                margin: 10,
                flex: 1,
              }}
              key={id}
            >
              <Icon source={getIconByKey(item.id)} size={15} />
              <Text style={{ fontSize: 13, padding: 2 }}>
                {inputValues[item.id]} {item.distanceMeasure}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
