import {
  Pressable,
  Text,
  TextInput,
  View,
  useThemeColor,
} from "../../components/Themed";
import { Image } from "expo-image";
import { useAuth } from "../../context/Auth";
import { StyleSheet } from "react-native";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import SelectorButton from "../../components/SelectorButton";

export default function SignUp() {
  const accentColor = useThemeColor({}, "accent");
  const textColor = useThemeColor({}, "text");
  const { signIn } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [userType, setUserType] = useState("Player");


  async function handleSubmit() {
    if (password !== passwordCheck) {
      alert("passwords don't match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredential.user);
      signIn("coach");
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
      <View style={styles.section}>
        <SelectorButton
          items={[
            { label: "Coach", value: "Coach" },
            { label: "Player", value: "Player" },
          ]}
          value={userType}
          setValue={setUserType}
        />
        <TextInput
          autoCapitalize="none"
          autoComplete="name"
          onChangeText={setName}
          style={[{ color: textColor }, styles.input]}
          placeholder="Name"
        />
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
        <TextInput
          autoCapitalize="none"
          autoComplete="password-new"
          autoCorrect={false}
          secureTextEntry={true}
          onChangeText={setPasswordCheck}
          style={[{ color: textColor }, styles.input]}
          placeholder="Confirm Password"
        />
        <Pressable
          style={[styles.button, { backgroundColor: accentColor }]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>
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
