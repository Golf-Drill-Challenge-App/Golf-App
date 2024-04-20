import { DefaultTheme, PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import DrillList from "~/components/drillList";
import ErrorComponent from "~/components/errorComponent";
import Header from "~/components/header";
import Loading from "~/components/loading";
import { useDrillInfo } from "~/hooks/useDrillInfo";

export default function Index() {
  const {
    data: drillInfo,
    error: drillInfoError,
    isLoading: drillInfoIsLoading,
  } = useDrillInfo();

  if (drillInfoIsLoading) {
    return <Loading />;
  }

  if (drillInfoError) {
    return <ErrorComponent message={drillInfoError} />;
  }

  return (
    <PaperProvider theme={DefaultTheme}>
      <SafeAreaView style={{ flex: 1 }} edges={["right", "top", "left"]}>
        <Header title={"Drills"} />

        <DrillList
          drillData={Object.values(drillInfo)}
          href={"content/drill/"}
        />
      </SafeAreaView>
    </PaperProvider>
  );
}
