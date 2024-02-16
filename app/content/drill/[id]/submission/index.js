import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaperProvider, Text } from "react-native-paper";
import Input from "./input";
import { AttemptData } from "~/testData";

export default function Index() {
  //Franks thoughts: State should be shared here between

  //a useState hook to track the inputs on each shot
  const [inputValues, setInputValues] = useState(
    Array.from({ length: AttemptData.shots.length }, () => ({}))
  );

  return (
    <PaperProvider>
      <Input inputValues={inputValues} setInputValues={setInputValues} />
    </PaperProvider>
  );
}
