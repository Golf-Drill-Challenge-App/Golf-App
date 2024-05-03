import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import RefreshInvalidate from "./refreshInvalidate";

function EmptyScreen({ invalidateKeys, text, preChild = () => {} }) {
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
          flex: 1,
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
    </ScrollView>
  );
}

export default EmptyScreen;
