import { useState } from "react";
import { PaperProvider } from "react-native-paper";
import { AttemptData } from "~/testData";
import Input from "./input";

export default function Index() {
  //Franks thoughts: State should be shared here between

  //a useState hook to track the inputs on each shot
  const [inputValues, setInputValues] = useState(
    Array.from({ length: AttemptData.shots.length }, () => ({})),
  );

  const [outputData, setOutputData] = useState([]);
  const [toggleResult, setToggleResult] = useState(false);

  const display = () => {
    if (toggleResult == true) {
      return <Result submission={outputData} />;
    } else {
      return (
        <Input
          inputValues={inputValues}
          setInputValues={setInputValues}
          setToggleResult={setToggleResult}
          setOutputData={setOutputData}
        />
      );
    }
  };

  return <PaperProvider>{display()}</PaperProvider>;
}
