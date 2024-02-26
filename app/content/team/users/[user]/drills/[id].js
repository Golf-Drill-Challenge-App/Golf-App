//assumed to be statistics
import { useLocalSearchParams } from "expo-router";
import BarChartScreen from "~/components/barChart";
import drillData from "~/drill_data.json";

export default function Stat() {
  const { user: user_id, id: drill_id } = useLocalSearchParams();
  console.log(drillData["teams"]["1"].users[user_id]);
  console.log(drillData["teams"]["1"].drills[drill_id]);
  return (
    <>
      <BarChartScreen
        drillData={
          drillData["teams"]["1"]["users"][user_id]["history"][drill_id]
        }
        mainOutputAttempt={
          drillData["teams"]["1"]["drills"][drill_id]["mainOutputAttempt"]
        }
      />
    </>
  );
}
