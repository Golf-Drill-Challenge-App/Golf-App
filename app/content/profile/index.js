import { Link } from "expo-router";
import { ScrollView, Text } from "react-native";
import DrillCard from "~/components/drillCard";
import ProfileCard from "~/components/profileCard";
import drillData from "~/drill_data.json";

function Index(props) {
  const user = drillData["teams"]["1"]["users"]["1"];
  const drills = drillData["teams"]["1"]["drills"];
  const attemptedDrills = user["history"]
    ? Object.keys(drills).filter((drillId) => drillId in user["history"])
    : [];
  return (
    <ScrollView>
      <ProfileCard user={user} />
      <Link push href="content/profile/statistics">
        go to statistics
      </Link>

      <Text>Drill History</Text>
      {user["history"] ? (
        attemptedDrills.map((drillId) => {
          return (
            <DrillCard
              drill={drills[drillId]}
              hrefString={"content/profile/drills/" + drillId}
              key={drillId}
            />
          );
        })
      ) : (
        <Text>No drills attempted yet</Text>
      )}
    </ScrollView>
  );
}

export default Index;
