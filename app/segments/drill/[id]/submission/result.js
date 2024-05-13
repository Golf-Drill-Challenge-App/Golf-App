import { useLocalSearchParams, useNavigation } from "expo-router";
import { Appbar, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "~/Constants";
import ErrorComponent from "~/components/errorComponent";
import Header from "~/components/header";
import Loading from "~/components/loading";
import ResultScreen from "~/components/resultScreen";
import { useDrillInfo } from "~/hooks/useDrillInfo";

function Result({ submission, setToggleResult }) {
  const navigation = useNavigation();
  const drillId = useLocalSearchParams()["id"];
  const {
    data: drillInfo,
    error: drillInfoError,
    isLoading: drillInfoIsLoading,
  } = useDrillInfo({ drillId: id });

  if (drillInfoIsLoading) return <Loading />;

  if (drillInfoError) return <ErrorComponent errorList={[drillInfoError]} />;

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
          marginTop: 5,
        }}
        labelStyle={{
          fontSize: 20,
          fontWeight: "bold",
          padding: 5,
          color: "#FFFFFF",
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
