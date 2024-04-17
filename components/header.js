import { View } from "react-native";
import { Appbar, Text } from "react-native-paper";

function Header({ title, subTitle, preChildren, postChildren }) {
  return (
    <Appbar.Header statusBarHeight={0} style={{ backgroundColor: "#F2F2F2" }}>
      {preChildren}
      <View
        style={{
          flex: 1,
          marginLeft: !preChildren ? 15 : 0,
        }}
      >
        <Text variant="titleLarge">{title}</Text>
        {subTitle && <Text style={{ fontSize: 12 }}>{subTitle}</Text>}
      </View>
      {postChildren}
    </Appbar.Header>
  );
}

export default Header;
