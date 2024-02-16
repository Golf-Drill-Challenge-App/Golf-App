import React from "react";
import { View, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaperProvider, Text } from "react-native-paper";
import { Link } from "expo-router";

// import Leaderboard from './drills/leaderboard'
// import Description from './drills/description'
// import Stat from './drills/stat'

export default function Index() {
  const [value, setValue] = React.useState("description");

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
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Open up App.js to start working on your app!</Text>
        {/*<Link
          href={{
            pathname: "/drill",
          }}
          style={{ marginTop: 10 }}
        >
          Go to Drills
        </Link>*/}
        <Link
          href={{
            pathname: "/team",
          }}
          style={{ marginTop: 10 }}
        >
          Go to Team
        </Link>
        <Link
          href={{
            pathname: "/team/users/1",
          }}
          style={{ marginTop: 10 }}
        >
          Go to Team, user
        </Link>
        <Link
          href={{
            pathname: "/team/users/1/drills/732489",
          }}
          style={{ marginTop: 10 }}
        >
          Go to Team, user, drill
        </Link>
      </SafeAreaView>
    </PaperProvider>
  );
}
