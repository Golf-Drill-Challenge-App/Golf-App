import { useLocalSearchParams, useNavigation } from "expo-router";
import React from "react";
import { Appbar, PaperProvider, SegmentedButtons } from "react-native-paper";

import Description from "./description";
import Leaderboard from "./leaderboard";
import Stat from "./statistics";

import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import Error from "~/components/error";
import Loading from "~/components/loading";
import db from "~/firebaseConfig";

export default function Index() {
  const [value, setValue] = React.useState("description");
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  console.log("ID: ", id);

  const { isPending, error, data } = useQuery({
    queryKey: ["drillInfo", id],
    queryFn: ({ queryKey }) => {
      const [_key, drillId] = queryKey;
      console.log("drillId: ", drillId);
      return getDoc(doc(db, "teams", "1", "drills", drillId));
    },
  });

  if (isPending) return <Loading />;

  if (error) {
    console.log("error: ", error);
    return <Error error={error.message} />;
  }

  const drillData = data?.data();

  const tabComponent = () => {
    switch (value) {
      case "leaderboard":
        return <Leaderboard />;
      case "description":
        return <Description />;
      case "stats":
        return <Stat />;
    }
  };

  return (
    <PaperProvider>
      <SafeAreaView style={{ flex: 1 }} edges={["right", "top", "left"]}>
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
