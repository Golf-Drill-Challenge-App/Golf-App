import React, { useEffect, useState } from "react";
import { PaperProvider, SegmentedButtons, Appbar } from "react-native-paper";
import { useNavigation, useLocalSearchParams } from "expo-router";

import Leaderboard from "./leaderboard";
import Description from "./description";
import Stat from "./statistics";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  getDocFromCache,
} from "firebase/firestore";
import { db } from "~/firebaseConfig";

export default function Index() {
  const [value, setValue] = React.useState("description");
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  const drillsRef = doc(db, "teams", "1", "drills", id);

  const [drillData, setDrillData] = useState({});

  useEffect(() => {
    getDoc(drillsRef).then((document) => {
      setDrillData(document.data());
    });
  }, []);

  const tabComponent = () => {
    switch (value) {
      case "leaderboard":
        return <Leaderboard />;
      case "description":
        return <Description descData={drillData} />;
      case "stats":
        return <Stat />;
    }
  };

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
          <Appbar.Content title={drillData.drillType} />
        </Appbar.Header>

        {/* Tab system */}

        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          buttons={[
            {
              value: "description",
              label: "Description",
            },
            {
              value: "leaderboard",
              label: "Leaderboard",
            },
            {
              value: "stats",
              label: "Stats",
            },
          ]}
        />

        {tabComponent()}
      </SafeAreaView>
    </PaperProvider>
  );
}
