import React from "react";
import drillData from "~/drill_data.json";
import ProfileCard from "~/components/profileCard";
import { ScrollView, Text } from "react-native";
import DrillCard from "~/components/drillCard";
import { Link } from "expo-router";

function Index(props) {
  const user = drillData["users"]["1"];
  const drills = drillData["drills"];
  const attemptedDrills = Object.keys(drills).filter(
    (drillId) => drillId in user["history"]
  );
  return (
    <ScrollView>
      <ProfileCard user={user} />
      <Link push href="content/profile/statistics">
        go to statistics
      </Link>

      <Text>Drill History</Text>
      {attemptedDrills.map((drillId) => {
        return (
          <DrillCard
            drill={drills[drillId]}
            hrefString={"content/profile/drills/" + drillId}
            key={drillId}
          />
        );
      })}
    </ScrollView>
  );
}

export default Index;
