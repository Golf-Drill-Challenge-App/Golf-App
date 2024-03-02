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
          }
          catch (error) {
              console.error("Could not fetch data from database.", error);
              setLoading(false);
          }
      }
      fetchData();
    
  }, []);


  const attemptData = {
    requirements: drillData.requirements,
    inputs: drillData.inputs
  };

  const fillRandomShotTargets = (min, max) => {
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

 


  attemptData.shots = fillRandomShotTargets(100, 150); //current this is getting recalled everytime state changes

  const [outputData, setOutputData] = useState([]);
  const [toggleResult, setToggleResult] = useState(false);

  const display = () => {
      if (toggleResult == true) {
          return <Result submission={outputData} />;
      } else if (!loading) {
          return (
              <Input
                  outputData={outputData}
                  attemptData={attemptData}
                  setToggleResult={setToggleResult}
                  setOutputData={setOutputData}
              />
          );
      }
      else {
          //Loading spinner icon
         return (<Text>Loading</Text>)
      }
  };

  return <PaperProvider>{display()}</PaperProvider>;
}
