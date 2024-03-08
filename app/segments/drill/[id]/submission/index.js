import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { PaperProvider } from "react-native-paper";

import Loading from "~/components/Loading";
import Input from "./input";
import Result from "./result";

import { doc, getDoc } from "firebase/firestore";
import { db } from "~/firebaseConfig";

export default function Index() {
  const { id } = useLocalSearchParams();

  const drillsRef = doc(db, "teams", "1", "drills", id);

  const [outputData, setOutputData] = useState([]);
  const [toggleResult, setToggleResult] = useState(false);
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

  const display = () => {
    if (loading) {
      return <Loading />;
    }
    if (toggleResult) {
      return <Result submission={outputData} drill={drillInfo} />;
    } else {
      return (
        <Input
          drillInfo={drillInfo}
          outputData={outputData}
          setToggleResult={setToggleResult}
          setOutputData={setOutputData}
        />
      );
    }
  };

  return <PaperProvider>{display()}</PaperProvider>;
}
