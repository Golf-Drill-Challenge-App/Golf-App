import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaperProvider, Text } from "react-native-paper";
import { Link, Redirect } from "expo-router";
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
