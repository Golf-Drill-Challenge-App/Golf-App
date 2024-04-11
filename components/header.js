import { View } from "react-native";
import { Appbar, Text } from "react-native-paper";

function Header({ drillInfo }) {
  return (
    <Appbar.Content
      title={
        <View style={{ width: "100%" }}>
          <Text style={{ fontSize: 20 }} variant="titleLarge">
            {drillInfo.drillType}
          </Text>
          <Text style={{ fontSize: 12 }}>{drillInfo.subType}</Text>
        </View>
      }
    />
  );
}

export default Header;
