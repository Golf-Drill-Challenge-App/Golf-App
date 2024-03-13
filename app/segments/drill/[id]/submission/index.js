import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { PaperProvider } from "react-native-paper";

import { lookUpBaselineStrokesGained } from "~/Utility";
import Loading from "~/components/loading";
import Input from "./input";
import Result from "./result";

import { useDrillInfo } from "../../../../../hooks/useDrillInfo";

export default function Index() {
  const { id } = useLocalSearchParams();

  const [outputData, setOutputData] = useState([]);
  const [toggleResult, setToggleResult] = useState(false);

  const {
    data: drillInfo,
    error: drillInfoError,
    isLoading: drillInfoIsLoading,
  } = useDrillInfo(id);

  if (drillInfoIsLoading) return <Loading />;

  if (drillInfoError) return <ErrorComponent error={drillInfoError.message} />;

  const attemptInfo = {
    requirements: drillInfo.requirements,
    inputs: drillInfo.inputs,
  };

  const fillRandomShotTargets = (min, max) => {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    let shots = [];

    for (var i = 0; i < drillInfo.reps; i++) {
      var target = Math.floor(
        Math.random() * (maxFloored - minCeiled + 1) + minCeiled,
      );
      var baseline = lookUpBaselineStrokesGained(target);
      shots.push({
        shotNum: i + 1,
        target: target,
        baseline: baseline,
      });
    }
    return shots;
  };

  const fillClubTargets = () => {
    let shots = [];
    for (var i = 0; i < drillInfo.reps; i++) {
      shots.push({
        shotNum: i + 1,
        target: drillInfo.requirements[0].items[i],
      });
    }
    console.log(shots);
    return shots;
  };

  console.log(drillInfo);
  console.log(id);
  const getShotInfo = () => {
    switch (drillInfo.drillType) {
      case "20 Shot Challenge":
        attemptInfo.shots = fillRandomShotTargets(
          drillInfo.requirement[0].min,
          drillInfo.requirement[0].max,
        ); //current this is getting recalled everytime state changes
        break;
      case "Line Test":
        attemptInfo.shots = fillClubTargets();
        break;
      default:
        attemptInfo.shots = null;
        break;
    }
    return;
  };

  const display = () => {
    if (toggleResult == true) {
      return <Result submission={outputData} drill={drillInfo} />;
    } else {
      getShotInfo();

      return (
        <Input
          drillInfo={drillInfo}
          outputData={outputData}
          attemptInfo={attemptInfo}
          setToggleResult={setToggleResult}
          setOutputData={setOutputData}
        />
      );
    }
  };

  return <PaperProvider>{display()}</PaperProvider>;
}
