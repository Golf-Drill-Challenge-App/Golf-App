import React, { useState } from "react";
import { PaperProvider } from "react-native-paper";

import Input from "./input";
//import { AttemptData } from "~/testData";
import Result from "./result";
import { lookUpBaselineStrokesGained } from '~/Utility'

export default function Index() {
  //Franks thoughts: State should be shared here between
  const attemptData = {
    requirements: [
      {
        id: "distance",
        description: "Target Distance",
        distanceMeasure: "yd",
          },
    ],
    inputs: [
      {
        id: "carry",
        icon: "arrow-up",
        prompt: "Carry Distance",
        distanceMeasure: "yd",
      },
      {
        id: "sideLanding",
        icon: "arrow-left-right",
        prompt: "Side Landing",
        distanceMeasure: "ft",
      },
    ],
  }
    const fillShotTargets = (min, max)  => {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        let shots = [];

        for (var i = 0; i < 20; i++) {
            var target = Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
            var baseline = lookUpBaselineStrokesGained(target);
            shots.push({
                shotNum: (i + 1),
                value: target,
                baseline: baseline,
            })
        }

        return shots;
    }

    attemptData.shots = fillShotTargets(100, 150);

  //a useState hook to track the inputs on each shot
  const [inputValues, setInputValues] = useState(
    Array.from({ length: attemptData.shots.length }, () => ({})),
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
          attemptData={attemptData}
          setToggleResult={setToggleResult}
          setOutputData={setOutputData}
        />
      );
    }
  };

  return <PaperProvider>{display()}</PaperProvider>;
}
