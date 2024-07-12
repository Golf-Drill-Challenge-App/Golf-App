import { Link } from "expo-router";
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
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
import { auth } from "~/firebaseConfig";
import { debounce } from "underscore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const BUTTON_WIDTH = 150;
const INPUT_WIDTH = 200;

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setCurrentUserId } = useAuthContext();

  const { height } = useWindowDimensions();

  const { showDialog } = useAlertContext();

  const [timeIntervalPassword, setTimeIntervalPassword] = useState(0)

  let intervalId

  useEffect(() => {
    if(timeIntervalPassword <= 0)
    clearInterval(intervalId)
  }, [intervalId, timeIntervalPassword]);

  const startTimeInterval = (interval)=>{
    console.log(interval)
    setTimeIntervalPassword(interval)
    intervalId = setInterval(()=> {
      setTimeIntervalPassword(timeIntervalPassword - 1)
      console.log(timeIntervalPassword)
    }, 1000)
  }

  async function handleSignIn() {
    if (process.env.EXPO_PUBLIC_TEST_UID) {
      // Only allow login as test user while using `yarn test` to reduce errors
      setCurrentUserId(process.env.EXPO_PUBLIC_TEST_UID);
      console.log("user changed. userId:", process.env.EXPO_PUBLIC_TEST_UID);
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (e) {
        console.log(e);
        showDialog("Error", getErrorString(e));
      }
    }
  }

  const handleForgotPassword = async ()=> {
    const currentDate = Date.now()
    const timeNextPasswordReset = await AsyncStorage.getItem('timeNextPasswordReset')
    console.log("timeNextPasswordReset", timeNextPasswordReset, "date now", currentDate)
    console.log("comparison", currentDate < parseInt(timeNextPasswordReset, 10))
    if(timeNextPasswordReset !== null && currentDate < parseInt(timeNextPasswordReset, 10)){
      // if(timeIntervalPassword <= 0)
      //   startTimeInterval((parseInt(timeNextPasswordReset, 10) - currentDate) / 1000)
      showDialog(
        "Error",
        "Please wait for another" + timeIntervalPassword + "seconds"
      );
      return;
    }
    if (!email) {
      showDialog(
        "Error",
        "Please enter an email address to reset your password",
      );
      return;
    }
    try {
      await sendPasswordResetEmail(getAuth(), email);
      const date = Date.now() + 60000;
      await AsyncStorage.setItem('timeNextPasswordReset', date.toString())
      startTimeInterval(60)
      showDialog("Success", "Password reset email sent");
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
    forgotPassword: {
      alignSelf: "flex-start",
      textDecorationLine: "underline",
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
          <Text style={styles.title}>Oregon State Golf</Text>
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
              backgroundColor={themeColors.accent}
            >
              <Text style={styles.buttonText}>Login</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              backgroundColor={themeColors.accent}
            >
              <Link asChild href={"/signup"}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </Link>
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}
