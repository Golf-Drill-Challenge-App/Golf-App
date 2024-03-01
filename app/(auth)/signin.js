import { Link } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
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
import { useAuth } from "~/context/Auth";
import { auth } from "~/firebaseConfig";
export default function SignIn() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit() {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log(userCredential.user);
      signIn();
    } catch (e) {
      // might remove console.error later and just use alert
      alert(e);
      console.error(e);
    }
  }
  return (
    <TouchableWithoutFeedback
      // dismiss keyboard after tapping outside of search bar input
      onPress={Keyboard.dismiss}
      accessible={false}
    >
      <View style={styles.container}>
        <View style={styles.section}>
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Oregon_State_Beavers_logo.svg/1200px-Oregon_State_Beavers_logo.svg.png",
              resizeMode: "contain",
              width: 131,
              height: 75,
            }}
            style={{ marginTop: 0 }}
          />
          <Text style={[styles.title]}>Oregon State Golf</Text>
        </View>
        <View style={styles.section}>
          <KeyboardAwareScrollView
            // allows opening links from search results without closing keyboard first
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
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
            <Text style={{ alignSelf: "flex-start" }}>
              Forgot your password?
            </Text>
            <Pressable style={[styles.button]} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Login</Text>
            </Pressable>
            <Pressable style={[styles.button]}>
              <Link asChild href={"/signup"}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </Link>
            </Pressable>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  section: {
    height: "70%",
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