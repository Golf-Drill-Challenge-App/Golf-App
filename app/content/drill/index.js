import { Link, useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import { Appbar, List, PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { collection, getDocs } from "firebase/firestore";
import db from "~/firebaseConfig";

export default function Index() {
  const [drills, setDrills] = React.useState([]); // [{}
  const drillsRef = collection(db, "teams", "1", "drills");
  const navigation = useNavigation();

  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    getDocs(drillsRef).then((querySnapshot) => {
      let newDrills = [];
      querySnapshot.forEach((doc) => {
        newDrills.push(doc.data());
      });
      setDrills(newDrills);
      setRefreshing(false);
    });
  }, [refreshing]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
  }, []);

  return (
    <PaperProvider>
      <SafeAreaView>
        <Appbar.Header statusBarHeight={0} style={{ backgroundColor: "FFF" }}>
          <Appbar.Content title="Drills" />
        </Appbar.Header>

        <ScrollView contentContainerStyle={styles.scrollView}>
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          <List.Section>
            {drills.map((drill) => (
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
