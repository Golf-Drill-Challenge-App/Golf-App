import { useLocalSearchParams, useNavigation } from "expo-router";
import { Appbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "~/Constants";
import Header from "~/components/header";
import ResultScreen from "~/components/resultScreen";

export default function Result() {
  const drillId = useLocalSearchParams()["id"];
  const attemptId = useLocalSearchParams()["attempt"];
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["right", "top", "left"]}>
      <Header
        title={"Drill Results"}
        preChildren={
          <Appbar.BackAction
            onPress={navigation.goBack}
            color={themeColors.accent}
          />
        }
      />
      <ResultScreen drillId={drillId} attemptId={attemptId} />
    </SafeAreaView>
  );
}
