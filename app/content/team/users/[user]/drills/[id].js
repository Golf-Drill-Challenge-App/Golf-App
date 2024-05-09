import { useLocalSearchParams, useNavigation } from "expo-router";
import { Appbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "~/Constants";
import BarChartScreen from "~/components/barChart";
import ErrorComponent from "~/components/errorComponent";
import Header from "~/components/header";
import Loading from "~/components/loading";
import PaperWrapper from "~/components/paperWrapper";
import { useAttempts } from "~/hooks/useAttempts";
import { useDrillInfo } from "~/hooks/useDrillInfo";

export default function Stat() {
  const navigation = useNavigation();
  const { user: userId, id: drillId } = useLocalSearchParams();

  const {
    data: drillInfo,
    error: drillInfoError,
    isLoading: drillInfoIsLoading,
  } = useDrillInfo({ drillId });

  const {
    data: drillAttempts,
    error: drillAttemptsError,
    isLoading: drillAttemptsIsLoading,
  } = useAttempts({ drillId, userId });

  const invalidateKeys = [
    ["drillInfo", { drillId }],
    ["attempts", { userId, drillId }],
  ];
  if (drillInfoIsLoading || drillAttemptsIsLoading) {
    return <Loading />;
  }

  if (drillInfoError || drillAttemptsError) {
    return <ErrorComponent errorList={[drillInfoError, drillAttemptsError]} />;
  }

  return (
    <PaperWrapper>
      <SafeAreaView style={{ flex: 1 }} edges={["right", "top", "left"]}>
        <Header
          title={"Statistics"}
          preChildren={
            <Appbar.BackAction
              onPress={() => {
                navigation.goBack();
              }}
              color={themeColors.accent}
            />
          }
        />

        <BarChartScreen
          drillData={drillAttempts}
          drillInfo={drillInfo}
          invalidateKeys={invalidateKeys}
        />
      </SafeAreaView>
    </PaperWrapper>
  );
}
