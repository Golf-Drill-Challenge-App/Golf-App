import { useNavigation } from "expo-router";
import { StyleSheet } from "react-native";
import { Appbar, PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import DrillList from "~/components/drillList";
import { useDrillInfo } from "~/hooks/useDrillInfo";

export default function Index() {
  const navigation = useNavigation();

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
    <PaperProvider>
      <SafeAreaView>
        <Appbar.Header statusBarHeight={0} style={{ backgroundColor: "FFF" }}>
          <Appbar.Content title="Drills" />
        </Appbar.Header>

        <DrillList drillData={drillInfo} href={"content/drill/"} />
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 16,
    paddingBottom: 50,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  item: {
    borderBottomWidth: 1, // Add bottom border
    borderBottomColor: "#ccc", // Grey color
  },
});
