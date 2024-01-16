import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function TestPage() {
  return (
    <View style={styles.container}>
      <Text>Test</Text>
      <Link href="/Home">Click Here to go to Home Page</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
});
