import { useLocalSearchParams, useNavigation } from "expo-router";

import { Appbar, PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import BarChartScreen from "~/components/barChart";
import drillData from "~/drill_data.json";

export default function Stat() {
  const navigation = useNavigation();
  const { user: user_id, id: drill_id } = useLocalSearchParams();
  return (
    <PaperProvider>
      <SafeAreaView>
        <Appbar.Header statusBarHeight={0} style={{ backgroundColor: "FFF" }}>
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack();
            }}
            color={"#F24E1E"}
          />
          <Appbar.Content title={"Statistics"} />
        </Appbar.Header>

        <BarChartScreen
          drillData={
            drillData["teams"]["1"]["users"][user_id]["history"][drill_id]
          }
          drillInfo={drillData["teams"]["1"]["drills"][drill_id]}
        />
      </SafeAreaView>
    </PaperProvider>
  );
}
