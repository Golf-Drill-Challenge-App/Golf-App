import React, { useEffect } from "react";
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
} from "firebase/firestore";
import { db } from "~/firebaseConfig";

export default function Index() {
  const [value, setValue] = React.useState("description");
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  const [refreshing, setRefreshing] = React.useState(false);
  const drillsRef = doc(db, "teams", "1", "attempts");
  const [drillData, setDrill] = React.useState([]); // [{}

  useEffect(() => {
    setDrill([]);
    getDocs(
      query(
        collection(db, "teams", "1", "attempts"),
        where("status", "==", "active"),
      ),
    )
      .then((querySnapshot) => {
        let newDrill = {};
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, [refreshing]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
  }, []);

  const findDrillAttempts = () => {
    let drillAttempts = [];

    return drillAttempts;
  };

  const drillLeaderboardAttempts = findDrillAttempts();

  console.log("Attempts: ", drillLeaderboardAttempts);

  const tabComponent = () => {
    switch (value) {
      case "leaderboard":
        return (
          <Leaderboard
            leaderboardData={drillLeaderboardAttempts}
            drillId={id}
          />
        );
      case "description":
        return <Description descData={drillData} drillId={id} />;
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
