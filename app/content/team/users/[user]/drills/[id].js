import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { Appbar, PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import BarChartScreen from "~/components/barChart";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import { currentAuthContext } from "~/context/Auth";
import { useAttempts } from "~/hooks/useAttempts";
import { useDrillInfo } from "~/hooks/useDrillInfo";

export default function Stat() {
  const navigation = useNavigation();
  const { user: userId, id: drillId } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const { currentTeamId } = currentAuthContext();
  console.log(currentTeamId);

  const {
    data: drillInfo,
    error: drillInfoError,
    isLoading: drillInfoIsLoading,
    isRefetching: drillInfoIsRefetching,
  } = useDrillInfo(drillId);

  const {
    data: drillAttempts,
    error: drillAttemptsError,
    isLoading: drillAttemptsIsLoading,
    isRefetching: drillAttemptsIsRefetching,
  } = useAttempts({ drillId, userId });

  const onRefresh = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [
        "attempts",
        currentTeamId,
        { drillId, userId },
        "drillInfo",
        { drillId },
      ],
    });
  }, []);

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
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={drillAttemptsIsRefetching || drillInfoIsRefetching}
              onRefresh={onRefresh}
            />
          }
        >
          <BarChartScreen drillData={drillAttempts} drillInfo={drillInfo} />
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
}
