import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { ActivityIndicator, PaperProvider } from "react-native-paper";

import { lookUpBaselineStrokesGained } from "~/Utility";
import Input from "./input";
import Result from "./result";
import Loading from "~/components/Loading"

import { doc, getDoc } from "firebase/firestore";
import { db } from "~/firebaseConfig";

export default function Index() {
  const { id } = useLocalSearchParams();

  const drillsRef = doc(db, "teams", "1", "drills", id);

  const [drillInfo, setDrillInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await getDoc(drillsRef).then((document) => {
          setDrillInfo(document.data());
        });

        setLoading(false);
      } catch (error) {
        console.error("Could not fetch data from database.", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
        value: target,
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
        value: drillInfo.requirements[0].items[i],
      });
    }
    return shots;
  };

  const getShotInfo = () => {
    switch (drillInfo.drillType) {
      case "20 Shot Challenge":
        attemptInfo.shots = fillRandomShotTargets(
          drillInfo.requirements[0].min,
          drillInfo.requirements[0].max,
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

  const [outputData, setOutputData] = useState([]);
  const [toggleResult, setToggleResult] = useState(false);

  const display = () => {
    if (loading) {
      return <Loading />
    }
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
