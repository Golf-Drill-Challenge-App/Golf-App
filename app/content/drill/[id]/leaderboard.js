import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { Avatar, Icon, List, Text } from "react-native-paper";
import drillsData from "~/drill_data.json";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "~/firebaseConfig";
import { numTrunc } from "~/Utility";
import {
  Link,
  useLocalSearchParams,
  usePathname,
  useSegments,
} from "expo-router";

export default function Leaderboard() {
  const drillId = useLocalSearchParams()["id"];
  const [userInfo, setUserInfo] = useState({});
  const currentPath = usePathname();

  const [drillLeaderboardAttempts, setDrillLeaderboardAttempts] = useState([]);
  const [drillInfo, setDrillInfo] = useState({});

  useEffect(() => {
    // massive data fetching on refresh. May or may not get its data from cache
    let mainOutputAttempt = "";
    getDocs(collection(db, "teams", "1", "users")).then((querySnapshot) => {
      // get all attempts
      const newUserInfo = {};
      querySnapshot.forEach((doc) => {
        newUserInfo[doc.id] = doc.data();
      });
      setUserInfo(newUserInfo);
      console.log("got attempts", userInfo);
    });
    getDoc(doc(db, "teams", "1", "drills", drillId)).then((doc) => {
      // get drill data
      if (doc.exists()) {
        mainOutputAttempt = doc.data()["mainOutputAttempt"];
        setDrillInfo(doc.data());
        console.log("got drill data", mainOutputAttempt);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    });
    getDocs(
      query(
        collection(db, "teams", "1", "attempts"),
        where("did", "==", drillId),
      ),
    )
      .then((querySnapshot) => {
        // get all attempts in drill and filter only the highest score for a user
        let newDrillAttempts = {};
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // console.log("data: ", data);
          if (!newDrillAttempts[data["uid"]])
            newDrillAttempts[data["uid"]] = {
              score: doc.data()[mainOutputAttempt],
              id: doc.id,
            };
          else if (
            newDrillAttempts[data["uid"]][mainOutputAttempt] <
            doc.data()[mainOutputAttempt]
          )
            newDrillAttempts[data["uid"]] = {
              score: doc.data()[mainOutputAttempt],
              id: doc.id,
            };
        });
        setDrillLeaderboardAttempts(
          Object.keys(newDrillAttempts).map((key) => {
            return {
              user: key,
              score: newDrillAttempts[key]["score"],
              id: newDrillAttempts[key]["id"],
            };
          }),
        );
        console.log("finished processing attempts", drillLeaderboardAttempts);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
    return () => {};
  }, []);

  const orderedLeaderboard = drillLeaderboardAttempts.sort(
    (a, b) => a["score"] - b["score"],
  );

  const getUserInfo = (userId) => {
    return userInfo[userId] || { name: "Unknown", uid: "unknown" };
  };

  console.log(drillLeaderboardAttempts);

  return (
    <ScrollView>
      <List.Section>
        {orderedLeaderboard.map((attempt) => (
          <Link
            key={attempt.user}
            href={{
              pathname: `${currentPath}/attempts/${attempt.id}`,
            }}
            asChild
          >
            <List.Item
              title={getUserInfo(attempt.user).name}
              left={() => <Avatar.Text size={24} label="XD" />}
              right={() => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text>{numTrunc(attempt.score)} ft</Text>
                  <Icon source="chevron-right" />
                </View>
              )}
            />
          </Link>
        ))}
      </List.Section>
    </ScrollView>
  );
}
