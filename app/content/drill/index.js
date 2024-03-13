import { Link, useNavigation } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { Appbar, List, PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
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

        <ScrollView contentContainerStyle={styles.scrollView}>
          <List.Section>
            {Object.values(drillInfo).map((drill) => (
              <Link
                key={drill.did}
                href={{
                  pathname: `/content/drill/${drill.did}`,
                  params: { id: drill.did },
                }}
                style={{ paddingVertical: 8 }}
              >
                <List.Item
                  title={drill.drillType}
                  description={drill.description}
                  titleStyle={styles.title}
                  descriptionStyle={styles.description}
                  left={() => (
                    <List.Icon
                      icon="file-document-outline" /*TODO: pick a better icon*/
                    />
                  )}
                  style={styles.item}
                />
              </Link>
            ))}
          </List.Section>
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 16,
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
