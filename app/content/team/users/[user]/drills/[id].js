import { useLocalSearchParams, useNavigation } from "expo-router";

import { Appbar, PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import BarChartScreen from "~/components/barChart";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import { useAttempts } from "~/hooks/useAttempts";
import { useDrillInfo } from "~/hooks/useDrillInfo";

export default function Stat() {
  const navigation = useNavigation();
  const { user: userId, id: drillId } = useLocalSearchParams();

  const {
    data: drillInfo,
    error: drillInfoError,
    isLoading: drillInfoIsLoading,
  } = useDrillInfo(drillId);

  const {
    data: drillAttempts,
    error: drillAttemptsError,
    isLoading: drillAttemptsIsLoading,
  } = useAttempts({ drillId, userId });

  if (drillInfoIsLoading || drillAttemptsIsLoading) {
    return <Loading />;
  }

  if (drillInfoError || drillAttemptsError) {
    return <ErrorComponent message={[drillInfoError, drillAttemptsError]} />;
  }

  return (
    <PaperProvider>
      <SafeAreaView style={{ flex: 1 }} edges={["right", "top", "left"]}>
        <Appbar.Header statusBarHeight={0} style={{ backgroundColor: "FFF" }}>
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack();
            }}
            color={"#F24E1E"}
          />
          <Appbar.Content title={"Statistics"} />
        </Appbar.Header>

        <BarChartScreen drillData={drillAttempts} drillInfo={drillInfo} />
      </SafeAreaView>
    </PaperProvider>
  );
}
