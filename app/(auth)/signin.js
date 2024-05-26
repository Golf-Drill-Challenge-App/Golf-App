import { Link } from "expo-router";
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
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
import DialogComponent from "~/components/dialog";
import PaperWrapper from "~/components/paperWrapper";
import { currentAuthContext } from "~/context/Auth";
import { auth } from "~/firebaseConfig";

const BUTTON_WIDTH = 150;
const INPUT_WIDTH = 200;

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setCurrentUserId } = currentAuthContext();

  const { height } = useWindowDimensions();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");

  const showDialog = (title, message) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogVisible(true);
  };

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

  async function handleForgotPassword() {
    if (!email) {
      showDialog(
        "Error",
        "Please enter an email address to reset your password",
      );
      return;
    }
    try {
      await sendPasswordResetEmail(getAuth(), email);
      showDialog("", "Password reset email sent");
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
      <PaperWrapper>
        <KeyboardAwareScrollView
          // allows opening links from search results without closing keyboard first
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <DialogComponent
              title={dialogTitle}
              content={dialogMessage}
              visible={dialogVisible}
              onHide={() => setDialogVisible(false)}
            />
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
      </PaperWrapper>
    </TouchableWithoutFeedback>
  );
}
