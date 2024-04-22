import { useLocalSearchParams, useNavigation } from "expo-router";
import { Appbar, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "~/components/header";
import ResultScreen from "~/components/resultScreen";
import { themeColors } from "~/Constants";

function Result({ submission, drillInfo, setToggleResult }) {
  const navigation = useNavigation();
  const drillId = useLocalSearchParams()["id"];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        title={drillInfo.drillType}
        subTitle={drillInfo.subType}
        preChildren={
          <Appbar.Action
            icon="close"
            onPress={navigation.goBack}
            color={themeColors.accent}
          />
        }
      />
      <ResultScreen drillId={drillId} attemptData={submission} />
      <Button
        style={{
          margin: 10,
        }}
        mode="contained"
        buttonColor={themeColors.accent}
        textColor="white"
        onPress={() => {
          setToggleResult(false);
        }}
      >
        Restart Drill
      </Button>
    </SafeAreaView>
  );
}

export default Result;
