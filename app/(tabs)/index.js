import { Text, View, StyleSheet, Pressable } from "react-native";
import { signOut as signoutFireBase } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useAuth } from "../../context/Auth";

export default function index() {
  const { signOut } = useAuth();
  return (
    <View style={styles.container}>
      <Text>Home</Text>
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
