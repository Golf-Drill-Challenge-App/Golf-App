import { StyleSheet } from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import {
  Pressable,
  Text,
  View,
  TextInput,
  useThemeColor,
} from "../../components/Themed";
import { useAuth } from "../../context/Auth";

// renamed signOut to signOutFireBase to avoid confusion with signOut in AuthContext
import { signOut as signoutFireBase } from "firebase/auth";
import { auth } from "../../firebaseConfig";

export default function Settings() {
  const { signOut } = useAuth();
  const accentColor = useThemeColor({}, "accent");
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Pressable
        style={[styles.button, { backgroundColor: accentColor }]}
        onPress={() => {
          signoutFireBase(auth);
          signOut();
        }}
      >
        <Text> Sign Out </Text>
      </Pressable>
      <EditScreenInfo path="app/(tabs)/Settings.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
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
