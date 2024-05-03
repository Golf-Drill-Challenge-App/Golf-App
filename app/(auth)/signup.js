import { Link } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
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
import { themeColors } from "~/Constants";
import { currentAuthContext } from "~/context/Auth";
import { auth, db } from "~/firebaseConfig";

const BUTTON_WIDTH = 150;
const INPUT_WIDTH = 200;

export default function SignUp() {
  const { setCurrentUserId } = currentAuthContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  async function handleSubmit() {
    if (password !== passwordCheck) {
      alert("Passwords don't match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(userCredential.user, {
        displayName: name,
      });
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: email,
      });
      await setDoc(doc(db, "teams", "1", "users", userCredential.user.uid), {
        name: name,
        // hardcoded pfp string for now, add pfp upload to profile settings in future PR
        pfp: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        // hardcoded "player" role for now, add role selection to profile settings in future PR
        role: "player",
        uid: userCredential.user.uid,
        assigned_data: [],
      });

      setCurrentUserId(userCredential.user.uid);

      // console.log(userCredential.user);
    } catch (e) {
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
          style={[styles.image]}
        />
        <Text style={[styles.title]}>Oregon State Golf</Text>

        <KeyboardAwareScrollView
          // allows opening links from search results without closing keyboard first
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.inputView]}>
            <Text style={[styles.placeholderText]}>Name</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="name"
              onChangeText={setName}
              style={[styles.input]}
            />
            <Text style={[styles.placeholderText]}>Email</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              onChangeText={setEmail}
              style={[styles.input]}
            />
            <Text style={[styles.placeholderText]}>Password</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="new-password"
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={setPassword}
              style={[styles.input]}
            />
            <Text style={[styles.placeholderText]}>Confirm Password</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="new-password"
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={setPasswordCheck}
              style={[styles.input]}
            />
            <Pressable
              style={[styles.button]}
              onPress={handleSubmit}
              backgroundColor={themeColors.accent}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </Pressable>
            <Pressable
              style={[styles.button]}
              backgroundColor={themeColors.accent}
            >
              <Link asChild href={"/signin"}>
                <Text style={styles.buttonText}>Back to Login</Text>
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
  inputView: {
    marginTop: 20,
  },
});
