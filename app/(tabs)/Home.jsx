import { Text, View, StyleSheet, Pressable } from "react-native";
import { signOut as signoutFireBase } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useAuth } from "../../context/Auth";
import { Link } from "expo-router";

export default function Home() {
  const { signOut } = useAuth();
  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Link href="/TestPage">Click here to go to Test Page</Link>
      <Pressable
        style={[styles.button]}
        onPress={() => {
          signoutFireBase(auth);
          signOut();
        }}
      >
        <Text> Sign Out </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  button: {
    borderRadius: 12,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    paddingVertical: 8,
    paddingHorizontal: 35,
  },
});
