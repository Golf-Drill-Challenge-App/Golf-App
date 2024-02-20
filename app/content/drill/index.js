import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Appbar, List, PaperProvider } from "react-native-paper";
import { Link, useNavigation } from "expo-router";

import drillsData from "~/drill_data.json";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const drills = drillsData.teams["1"].drills;
  const navigation = useNavigation();

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
          <Appbar.Content title="Drills" />
        </Appbar.Header>

        <ScrollView contentContainerStyle={styles.scrollView}>
          <List.Section>
            {Object.values(drills).map((drill) => (
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
