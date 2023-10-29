import { StyleSheet } from "react-native";
import {
  Pressable,
  Text,
  View,
  TextInput,
  useThemeColor,
} from "../../components/Themed";
import { useAuth } from "../../context/Auth";
import { Image } from "expo-image";
import { Link } from "expo-router";

export default function SignIn() {
  const { signIn } = useAuth();
  const accentColor = useThemeColor({}, "accent");

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Image
          style={styles.image}
          source={require("../../assets/images/appLogo.png")}
          contentFit="contain"
          contentPosition="center"
        />
        <Text style={[styles.title, { color: accentColor }]}>
          Oregon State Golf
        </Text>
      </View>
      <View style={styles.section}>
        {/* TODO: Refactor TextInput into Themed */}
        <TextInput style={styles.input} placeholder="Email" />
        <TextInput style={styles.input} placeholder="Password" />
        <Text style={{ alignSelf: "flex-start" }}>Forgot your password?</Text>
        <Pressable
          style={[styles.button, { backgroundColor: accentColor }]}
          onPress={() => signIn("player")}
        >
          <Text style={styles.buttonText}>Login (Player)</Text>
        </Pressable>
        <Pressable
          style={[styles.button, { backgroundColor: accentColor }]}
          onPress={() => signIn("coach")}
        >
          <Text style={styles.buttonText}>Login (Coach)</Text>
        </Pressable>
        <Link asChild href={"/SignUp"}>
          <Pressable style={[styles.button, { backgroundColor: accentColor }]}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  section: {
    height: "50%",
    width: "85%",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "20%",
    height: "20%",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 5,
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
  input: {
    marginVertical: 5,
    width: "100%",
  },
});
