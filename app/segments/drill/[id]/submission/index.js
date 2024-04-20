import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { DefaultTheme, PaperProvider } from "react-native-paper";

import Loading from "~/components/loading";
import Input from "./input";
import Result from "./result";

import ErrorComponent from "~/components/errorComponent";
import { useDrillInfo } from "~/hooks/useDrillInfo";

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

  const display = () => {
    if (toggleResult) {
      return (
        <Result
          submission={outputData}
          drill={drillInfo}
          setToggleResult={setToggleResult}
        />
      );
    } else {
      return (
        <Input
          drillInfo={drillInfo}
          setToggleResult={setToggleResult}
          setOutputData={setOutputData}
        />
      );
    }
  };

  return <PaperProvider theme={DefaultTheme}>{display()}</PaperProvider>;
}
