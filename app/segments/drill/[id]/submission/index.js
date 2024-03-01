import { useState } from "react";
import { PaperProvider } from "react-native-paper";

import Input from "./input";
import Result from "./result";
import { lookUpBaselineStrokesGained } from "~/Utility";

export default function Index() {
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
  };
  const fillShotTargets = (min, max) => {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    let shots = [];

    for (var i = 0; i < 20; i++) {
      var target = Math.floor(
        Math.random() * (maxFloored - minCeiled + 1) + minCeiled,
      );
      var baseline = lookUpBaselineStrokesGained(target);
      shots.push({
        shotNum: i + 1,
        value: target,
        baseline: baseline,
      });
    }
    console.log("Attempt Data changed");
    return shots;
  };

  attemptData.shots = fillShotTargets(100, 150); //current this is getting recalled everytime state changes

  const [outputData, setOutputData] = useState([]);
  const [toggleResult, setToggleResult] = useState(false);

  const display = () => {
    if (toggleResult == true) {
      return <Result submission={outputData} />;
    } else {
      return (
        <Input
          outputData={outputData}
          attemptData={attemptData}
          setToggleResult={setToggleResult}
          setOutputData={setOutputData}
        />
      );
    }
  };

  return <PaperProvider>{display()}</PaperProvider>;
}
