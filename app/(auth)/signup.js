import { Link } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { themeColors } from "~/Constants";
import { getErrorString } from "~/Utility";
import ProfilePicture from "~/components/ProfilePicture";
import { useAlertContext } from "~/context/Alert";
import { useAuthContext } from "~/context/Auth";
import { auth, db } from "~/firebaseConfig";

const BUTTON_WIDTH = 150;
const INPUT_WIDTH = 200;

export default function SignUp() {
  const { setCurrentUserId, setCurrentUserInfo } = useAuthContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const { showDialog } = useAlertContext();

  const { height } = useWindowDimensions();

  async function handleSubmit() {
    try {
      if (password !== passwordCheck) {
        throw "Passwords don't match";
      }
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
        pfp: "",
        // hardcoded "player" role for now, add role selection to profile settings in future PR
        role: "player",
        uid: userCredential.user.uid,
        assigned_data: [],
        uniqueDrills: [],
      });

      setCurrentUserId(userCredential.user.uid);
      setCurrentUserInfo(userCredential.user);

      // console.log(userCredential.user);
    } catch (e) {
      console.log(e);
      showDialog("Error", getErrorString(e));
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      height: height,
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

  return (
    <TouchableWithoutFeedback
      // dismiss keyboard after tapping outside of search bar input
      onPress={Keyboard.dismiss}
      accessible={false}
    >
      <KeyboardAwareScrollView
        // allows opening links from search results without closing keyboard first
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <ProfilePicture
            style={{ width: 131, height: 75, marginTop: 0 }}
            userInfo={{
              pfp: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Oregon_State_Beavers_logo.svg/1200px-Oregon_State_Beavers_logo.svg.png",
            }}
          />
          <Text style={[styles.title]}>Oregon State Golf</Text>
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
              // to get rid of ios password suggestions
              // More info on onChangeText + ios password suggestions bug: https://github.com/facebook/react-native/issues/21261
              // Workaround ("oneTimeCode" textContentType): https://stackoverflow.com/a/68658035
              textContentType="oneTimeCode"
            />
            <Text style={[styles.placeholderText]}>Confirm Password</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="new-password"
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={setPasswordCheck}
              style={[styles.input]}
              // to get rid of ios password suggestions
              // More info on onChangeText + ios password suggestions bug: https://github.com/facebook/react-native/issues/21261
              // Workaround ("oneTimeCode" textContentType): https://stackoverflow.com/a/68658035
              textContentType="oneTimeCode"
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
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}
