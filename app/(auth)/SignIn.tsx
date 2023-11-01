import { KeyboardAvoidingView, StyleSheet } from "react-native";
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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useState } from "react";

export default function SignIn() {
  const { signIn } = useAuth();
  const accentColor = useThemeColor({}, "accent");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const textColor = useThemeColor({}, "text");

  async function handleSubmit() {
    try {
      const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
      );
      console.log(userCredential.user);
      signIn();
    } catch (e) {
      console.error("Error signing user up:", e);
    }
  }
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
        <KeyboardAvoidingView behavior="padding">
          <View style={styles.section}>
            {/* TODO: Refactor TextInput into Themed */}
            <TextInput
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                onChangeText={setEmail}
                style={[{ color: textColor }, styles.input]}
                placeholder="Email"
            />
            <TextInput
                autoCapitalize="none"
                autoComplete="password-new"
                autoCorrect={false}
                secureTextEntry={true}
                onChangeText={setPassword}
                style={[{ color: textColor }, styles.input]}
                placeholder="Password"
            />
            <Text style={{ alignSelf: "flex-start" }}>Forgot your password?</Text>
            <Pressable
                style={[styles.button, { backgroundColor: accentColor }]}
                onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Login</Text>
            </Pressable>
            <Link asChild href={"/SignUp"}>
              <Pressable style={[styles.button, { backgroundColor: accentColor }]}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </Pressable>
            </Link>
          </View>
        </KeyboardAvoidingView>
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
