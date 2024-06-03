import { View } from "react-native";
import { Icon, Text } from "react-native-paper";
import { themeColors } from "~/Constants";

export default function AssignmentCard({ mainText, subText, completed, pfp }) {
  return (
    <View style={{ marginLeft: 20, marginRight: 20 }}>
      <View
        style={{
          flexDirection: "row",
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.2)",
          alignItems: "center",
          width: "100%",
          minHeight: 65,
          backgroundColor: themeColors.highlight,
          borderRadius: 20,
          marginBottom: 10,
          paddingLeft: 30,
          paddingRight: 30,
          paddingTop: 5,
          paddingBottom: 5,
        }}
      >
        {pfp}
        <View
          style={{
            flexDirection: "column",
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: 0,
          }}
        >
          <Text style={{ fontSize: 20 }}>{mainText}</Text>
          {subText ? (
            <Text style={{ fontSize: 14, color: "grey" }}>{subText}</Text>
          ) : null}
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {completed ? (
            <Icon source="check" size={28} color="green" />
          ) : (
            completed !== undefined && <View style={{ width: 28 }} />
          )}
          <View style={{ paddingLeft: 10 }}>
            <Icon source="chevron-right" size={20} />
          </View>
        </View>
      </View>
    </View>
  );
}
