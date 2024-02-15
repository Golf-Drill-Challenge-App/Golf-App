import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaperProvider, Text } from "react-native-paper";
import Input from "./input";

export default function Index() {
  //Franks thoughts: State should be shared here between

  return (
    <PaperProvider>
      <Input />
    </PaperProvider>
  );
}
