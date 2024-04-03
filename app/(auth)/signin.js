import { Link } from "expo-router";
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import {
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { auth } from "~/firebaseConfig";

const BUTTON_WIDTH = 150;
const INPUT_WIDTH = 200;

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignIn() {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log(userCredential.user);
    } catch (e) {
      alert(e);
      console.log(e);
    }
  }

  async function handleForgotPassword() {
    try {
      if (email === "") {
        throw "Please enter an email address for password reset";
      }
      sendPasswordResetEmail(getAuth(), email)
        .then(() => {
          alert("Password reset email sent");
        })
        .catch((e) => {
          alert(e);
          console.log(e);
        });
    } catch (e) {
      // dual catch but had to handle empty email
      alert(e);
      console.log(e);
    }
  }

  return (
    <TouchableWithoutFeedback
      // dismiss keyboard after tapping outside of search bar input
      onPress={Keyboard.dismiss}
      accessible={false}
    >
      <View style={styles.container}>
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Oregon_State_Beavers_logo.svg/1200px-Oregon_State_Beavers_logo.svg.png",
            resizeMode: "contain",
            width: 131,
            height: 75,
          }}
          style={styles.image}
        />
        <Text style={styles.title}>Oregon State Golf</Text>
        <KeyboardAwareScrollView
          // allows opening links from search results without closing keyboard first
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputView}>
            <Text style={styles.placeholderText}>Email</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              onChangeText={setEmail}
              style={styles.input}
            />
            <Text style={styles.placeholderText}>Password</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={setPassword}
              style={styles.input}
            />
            <Pressable style={styles.button} onPress={handleForgotPassword}>
              <Text style={styles.forgotPassword}>Forgot your password?</Text>
            </Pressable>

            <Pressable
              style={styles.button}
              onPress={handleSignIn}
              backgroundColor={"#F24E1E"}
            >
              <Text style={styles.buttonText}>Login</Text>
            </Pressable>
            <Pressable style={styles.button} backgroundColor={"#F24E1E"}>
              <Link asChild href={"/signup"}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </Link>
            </Pressable>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 100,
  },
  image: {
    marginTop: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 5,
  },
  button: {
    borderRadius: 12,
    marginTop: 20,
    marginHorizontal: (INPUT_WIDTH - BUTTON_WIDTH) / 2,
    width: BUTTON_WIDTH,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    paddingVertical: 8,
    textAlign: "center",
  },
  input: {
    marginVertical: 5,
    paddingVertical: Platform.OS === "ios" ? 10 : 5, // padding and margins on ios look different than android?
    backgroundColor: "white",
    paddingHorizontal: 5,
    width: INPUT_WIDTH,
    maxWidth: INPUT_WIDTH,
  },
  placeholderText: {
    marginTop: 5,
  },
  forgotPassword: {
    alignSelf: "flex-start",
    textDecorationLine: "underline",
  },
  inputView: {
    marginTop: 20,
  },
});
