import { StyleSheet, Pressable, Text, View, TextInput } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAuth } from "../../context/Auth";
import { Link } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useState } from "react";

export default function SignIn() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        <Text style={[styles.title]}>Oregon State Golf</Text>
      </View>
      <View style={styles.section}>
        <KeyboardAwareScrollView>
          {/* TODO: Refactor TextInput into Themed */}
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            onChangeText={setEmail}
            style={[styles.input]}
            placeholder="Email"
          />
          <TextInput
            autoCapitalize="none"
            autoComplete="password-new"
            autoCorrect={false}
            secureTextEntry={true}
            onChangeText={setPassword}
            style={[styles.input]}
            placeholder="Password"
          />
          <Text style={{ alignSelf: "flex-start" }}>Forgot your password?</Text>
          <Pressable style={[styles.button]} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
          <Pressable style={[styles.button]}>
            <Link asChild href={"/SignUp"}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </Link>
          </Pressable>
        </KeyboardAwareScrollView>
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
    color: "black",
    paddingVertical: 8,
    paddingHorizontal: 35,
  },
  input: {
    marginVertical: 5,
    width: "100%",
  },
});
