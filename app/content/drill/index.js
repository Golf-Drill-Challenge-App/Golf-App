import { useNavigation } from "expo-router";
import { Appbar, PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import DrillList from "~/components/drillList";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import { useDrillInfo } from "~/hooks/useDrillInfo";

export default function Index() {
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const {
    data: drillInfo,
    error: drillInfoError,
    isLoading: drillInfoIsLoading,
  } = useDrillInfo();

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      queryClient.invalidateQueries({
        queryKey: ["drillInfo"],
      });
      setRefreshing(false);
    }, 500);
  }, []);

  if (drillInfoIsLoading) {
    return <Loading />;
  }

  if (drillInfoError) {
    return <ErrorComponent message={drillInfoError} />;
  }

  return (
    <PaperProvider>
      <SafeAreaView style={{ flex: 1 }} edges={["right", "top", "left"]}>
        <Appbar.Header statusBarHeight={0} style={{ backgroundColor: "FFF" }}>
          <Appbar.Content title="Drills" />
        </Appbar.Header>

        <DrillList
          drillData={Object.values(drillInfo)}
          href={"content/drill/"}
        />
      </SafeAreaView>
    </PaperProvider>
  );
}
