import { View } from "react-native";
import {
  Divider,
  Icon,
  Surface,
  Text,
  TouchableRipple,
} from "react-native-paper";

import { getIconByKey } from "~/Utility";

export default function NavigationRectangle({
  drillInfo,
  inputValues,
  shot,
  currentShot,
  pressFunction,
}) {
  return (
    <Surface
      style={{
        borderRadius: 10,
        width: "80%",
        elevation: 10,
      }}
    >
      <View
        style={{
          overflow: "hidden",
          borderRadius: 10,
        }}
      >
        <TouchableRipple
          onPress={() => {
            pressFunction();
          }}
          rippleColor="rgba(0, 0, 0, 0.2)"
          style={{
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              backgroundColor: "rgba(217, 217, 217, 0.7)",
              padding: 10,
              paddingLeft: 20,
              paddingRight: 20,
              borderRadius: 10,
              maxHeight: 250,
              width: "100%",
              position: "relative",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 20,
                  }}
                >
                  Shot{" "}
                  <Text style={{ fontWeight: "bold" }}>{shot.shotNum}</Text>
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
                        {shot.items[requirement.name]}{" "}
                        {requirement.distanceMeasure}
                      </Text>
                    </Text>
                  ))}
                </View>

                <Divider
                  style={{
                    backgroundColor: "#A0A0A0",
                    height: 1,
                    width: "100%",
                  }}
                />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                  }}
                >
                  {currentShot + 1 == shot.shotNum ? (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 10,
                      }}
                    >
                      <Text
                        style={{ fontSize: 13, padding: 2, fontWeight: "bold" }}
                      >
                        Current Shot
                      </Text>
                    </View>
                  ) : (
                    drillInfo.inputs.map((input, id) => {
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
                    })
                  )}
                </View>
              </View>
            </View>
          </View>
        </TouchableRipple>
      </View>
    </Surface>
  );
}
