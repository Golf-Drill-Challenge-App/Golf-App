import { useState } from "react";
import { PaperProvider } from "react-native-paper";
import { AttemptData } from "~/testData";
import Input from "./input";

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

  console.log(drillData);

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
    console.log("Attempt Data changed");
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
    if (toggleResult == true) {
      return <Result submission={outputData} />;
    } else if (!loading) {
      getAttemptDataShots();

      return (
        <Input
          drillTitle={drillData.drillType}
          outputData={outputData}
          attemptData={attemptData}
          setToggleResult={setToggleResult}
          setOutputData={setOutputData}
        />
      );
    } else {
      //Loading spinner icon
      return <Text>Loading</Text>;
    }
  };

  return <PaperProvider>{display()}</PaperProvider>;
}
