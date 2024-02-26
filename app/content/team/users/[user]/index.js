import { Link, useLocalSearchParams } from "expo-router";
import { ScrollView, Text } from "react-native";
import DrillCard from "~/components/drillCard";
import ProfileCard from "~/components/profileCard";
import drillData from "~/drill_data.json";

function Index(props) {
  const { user: user_id } = useLocalSearchParams();
  const userData = drillData["teams"]["1"]["users"][user_id];
  const drills = drillData["teams"]["1"]["drills"];
  console.log(userData);
  const attemptedDrills = userData["history"]
    ? Object.keys(drills).filter((drillId) => drillId in userData["history"])
    : [];
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
      {userData["history"] ? (
        attemptedDrills.map((drillId) => {
          return (
            <DrillCard
              drill={drills[drillId]}
              hrefString={
                "/content/team/users/" + userData.uid + "/drills/" + drillId
              }
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
