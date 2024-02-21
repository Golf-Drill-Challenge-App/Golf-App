import React, { useState } from "react";
import { PaperProvider } from "react-native-paper";
import Input from "./input";
import { AttemptData } from "~/testData";
import Result from "./result";

export default function Index() {
  //Franks thoughts: State should be shared here between

  //a useState hook to track the inputs on each shot
  const [inputValues, setInputValues] = useState(
    Array.from({ length: AttemptData.shots.length }, () => ({})),
  );

  const [outputData, setOutputData] = useState([]);
  const [toggleResult, setToggleResult] = useState(false);

  return (
    <PaperProvider>
      <Input
        inputValues={inputValues}
        setInputValues={setInputValues}
        setToggleResult={setToggleResult}
        setOutputData={setOutputData}
      />
      {toggleResult && <Result submission={outputData} />}
    </PaperProvider>
  );
}
