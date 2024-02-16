import React from "react";
import teamData from "~/team_data.json";
import ProfileCard from "~/components/profileCard";
import { ScrollView, Text } from "react-native";
import DrillCard from "~/components/drillCard";
import { Link, useLocalSearchParams } from "expo-router";

function Index(props) {
  const { user: user_id } = useLocalSearchParams();
  const team = teamData["teams"]["1"];
  const userData = team["users"][user_id];
  const drills = team["drills"];
  console.log(userData);
  const attemptedDrills = Object.keys(drills).filter(
    (drillId) => drillId in userData["history"]
  );
  // console.log(attemptedDrills);
  return (
    <ScrollView>
      <Link
        href={{
          pathname: "/",
        }}
        style={{ marginBottom: 10 }}
      >
        Go back to Index
      </Link>
      <ProfileCard user={userData} />

      <Text>Drill History</Text>
      {attemptedDrills.map((drillId) => {
        return (
          <DrillCard
            drill={drills[drillId]}
            hrefString={"/team/users/" + userData.uid + "/drills/" + drillId}
            key={drillId}
          />
        );
      })}
    </ScrollView>
  );
}

export default Index;
