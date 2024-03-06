import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { ActivityIndicator, PaperProvider } from "react-native-paper";

import { lookUpBaselineStrokesGained } from "~/Utility";
import Input from "./input";
import Result from "./result";

import { doc, getDoc } from "firebase/firestore";
import { db } from "~/firebaseConfig";

export default function Index() {
  const { id } = useLocalSearchParams();

  const drillsRef = doc(db, "teams", "1", "drills", id);

  const [drillData, setDrillData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await getDoc(drillsRef).then((document) => {
          setDrillData(document.data());
        });

        setLoading(false);
      } catch (error) {
        console.error("Could not fetch data from database.", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const attemptData = {
    requirements: drillData.requirements,
    inputs: drillData.inputs,
  };

  const fillRandomShotTargets = (min, max) => {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    let shots = [];

    for (var i = 0; i < drillData.reps; i++) {
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
    for (var i = 0; i < drillData.reps; i++) {
      shots.push({
        shotNum: i + 1,
        value: drillData.requirements[0].items[i],
      });
    }
    return shots;
  };

  const getAttemptDataShots = () => {
    switch (drillData.drillType) {
      case "20 Shot Challenge":
        attemptData.shots = fillRandomShotTargets(
          drillData.requirements[0].min,
          drillData.requirements[0].max,
        ); //current this is getting recalled everytime state changes
        break;
      case "Line Test":
        attemptData.shots = fillClubTargets();
        break;
      default:
        attemptData.shots = null;
        break;
    }
    return;
  };

  const [outputData, setOutputData] = useState([]);
  const [toggleResult, setToggleResult] = useState(false);

  const display = () => {
    if (!loading && toggleResult == true) {
      return <Result submission={outputData} drill={drillData} />;
    } else if (!loading && toggleResult == false) {
      getAttemptDataShots();

      return (
        <Input
          drillTitle={drillData.drillType}
          outputs={drillData.outputs}
          aggOutputs={drillData.aggOutputs}
          outputData={outputData}
          attemptData={attemptData}
          setToggleResult={setToggleResult}
          setOutputData={setOutputData}
        />
      );
    } else {
      //Loading spinner icon
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator animating={true} size="large" color="#F24E1E" />
        </View>
      );
    }
  };

  return <PaperProvider>{display()}</PaperProvider>;
}
