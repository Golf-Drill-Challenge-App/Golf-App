import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import RefreshInvalidate from "./refreshInvalidate";

function EmptyScreen({
  invalidateKeys,
  text,
  preChild = () => {},
  postChild = () => {},
}) {
  if (typeof preChild === "object") {
    const preChildObj = preChild;
    preChild = () => {
      return preChildObj;
    };
  }
  return (
    <ScrollView
      refreshControl={
        // handle updating cache for another user list of drills
        <RefreshInvalidate invalidateKeys={invalidateKeys} />
      }
      contentContainerStyle={{ flex: 1 }}
    >
      {preChild()}
      <View
        style={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            textAlign: "center",
            color: "gray",
          }}
        >
          {text}
        </Text>
      </View>
      {postChild()}
    </ScrollView>
  );
}

export default EmptyScreen;
