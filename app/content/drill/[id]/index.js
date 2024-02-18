import React, { useEffect } from "react";
import { PaperProvider, SegmentedButtons, Appbar } from "react-native-paper";
import { useNavigation, useLocalSearchParams } from "expo-router";

import Leaderboard from "./leaderboard";
import Description from "./description";
import Stat from "./statistics";

import { SafeAreaView } from "react-native-safe-area-context";

import { doc, getDoc } from "firebase/firestore";
import { db } from "~/firebaseConfig";

export default function Index() {
  const [value, setValue] = React.useState("description");
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  const [refreshing, setRefreshing] = React.useState(false);
  const drillsRef = doc(db, "teams", "1", "drills", id);
  const [drill, setDrill] = React.useState([]); // [{}

  useEffect(() => {
    setDrill([]);
    getDoc(drillsRef).then((querySnapshot) => {
      setDrill(querySnapshot.data());
      setRefreshing(false);
    });
  }, [refreshing]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
  }, []);

  const findDrillAttempts = () => {
    const drillAttempts = [];
    const team = drillsData.teams["1"];

    Object.values(team.users).forEach((user) => {
      if (!user.history) return; // idk if "no drills attempted" or something should be shown on leaderboard
      Object.values(user.history).forEach((drill) => {
        if (Object.keys(user.history).includes(id)) {
          drill.forEach((attempt) => {
            if (drillAttempts.length === 0) {
              drillAttempts.push({
                attempts: [attempt.averageProximity],
                totalSubmissions: 1,
                userId: user.uid,
              });
            } else {
              var userIdx = -1;
              for (let i = 0; i < drillAttempts.length; i++) {
                if (drillAttempts[i].userId === user.uid) {
                  userIdx = i;
                  break;
                }
              }

              if (userIdx >= 0) {
                drillAttempts[userIdx].attempts.push(attempt.averageProximity);
                drillAttempts[userIdx].totalSubmissions++;
              } else {
                drillAttempts.push({
                  attempts: [attempt.averageProximity],
                  totalSubmissions: 1,
                  userId: user.uid,
                });
              }
            }
          });
        }
      });
    });

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
