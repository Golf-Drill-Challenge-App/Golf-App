import { Link, Redirect } from "expo-router";
import { useState } from "react";
import { PaperProvider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
//This is the root file
export default function Index() {
  const [signedIn, setSignedin] = useState(true);
  return (
    <PaperProvider>
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        {signedIn ? (
          <Redirect href={"/content"} />
        ) : (
          <Text>Open up App.js to start working on your app!</Text>
        )}

        <Text>Open up App.js to start working on your app!</Text>
        <Link href={"/content"}>go to content</Link>
        <Link href={"/drill/1234"}>/drill/1234 slug</Link>
      </SafeAreaView>
    </PaperProvider>
  );
}
