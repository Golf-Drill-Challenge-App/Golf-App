import { View } from "react-native";
import { Divider, Icon, Text } from "react-native-paper";

import { getIconByKey } from "~/Utility";

export default function NavigationRectangle({ drillInfo, inputValues, shot }) {
  console.log("inputValues", inputValues);
  const keys = Object.keys(inputValues);
  return (
    <View
      style={{
        backgroundColor: "#d9d9d9",
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 10,
        maxHeight: 250,
        width: "80%",
        overflow: "hidden",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        elevation: 5,
      }}
    >
      <View>
        <Text
          style={{
            fontSize: 20,
          }}
        >
          Shot <Text style={{ fontWeight: "bold" }}>{shot.shotNum}</Text>
        </Text>
      </View>

      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          {drillInfo.requirements.map((requirement) => (
            <Text
              key={requirement.name}
              style={{
                fontSize: 16,
                padding: 2,
              }}
            >
              {requirement.prompt}:
              <Text style={{ fontWeight: "bold" }}>
                {" "}
                {shot.items[requirement.name]} {requirement.distanceMeasure}
              </Text>
            </Text>
          ))}
        </View>

        {keys.length > 0 && !keys.some((key) => !inputValues[key]) && (
          <Divider
            style={{ backgroundColor: "#A0A0A0", height: 1, width: "100%" }}
          />
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          {drillInfo.inputs.map((input, id) => {
            if (inputValues[input.id]) {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 10,
                  }}
                  key={id}
                >
                  <Icon source={getIconByKey(input.id)} size={15} />
                  <Text style={{ fontSize: 13, padding: 2 }}>
                    {inputValues[input.id]} {input.distanceMeasure}
                  </Text>
                </View>
              );
            }
          })}
        </View>
      </View>
    </View>
  );
}
