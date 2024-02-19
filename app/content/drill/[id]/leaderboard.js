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

export default function Leaderboard({ leaderboardData, drillId }) {
  const [userInfo, setUserInfo] = useState({});

  const [drillLeaderboardAttempts, setDrillLeaderboardAttempts] = useState([]);

  useEffect(() => {
    // massive data fetching on refresh. May or may not get its data from cache
    let mainOutputAttempt = "";
    getDocs(collection(db, "teams", "1", "users")).then((querySnapshot) => {
      // get all users
      const newUserInfo = {};
      querySnapshot.forEach((doc) => {
        newUserInfo[doc.id] = doc.data();
      });
      setUserInfo(newUserInfo);
      console.log("got users", userInfo);
    });
    getDoc(doc(db, "teams", "1", "drills", drillId)).then((doc) => {
      // get drill data
      if (doc.exists()) {
        mainOutputAttempt = doc.data()["mainOutputAttempt"];
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
        console.log("got attempts from ", drillId);
        let newDrillAttempts = {};
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log("data: ", data);
          if (!newDrillAttempts[data["uid"]])
            newDrillAttempts[data["uid"]] = doc.data()[mainOutputAttempt];
          else if (
            newDrillAttempts[data["uid"]][mainOutputAttempt] <
            doc.data()[mainOutputAttempt]
          )
            newDrillAttempts[data["uid"]] = doc.data()[mainOutputAttempt];
        });
        setDrillLeaderboardAttempts(
          Object.keys(newDrillAttempts).map((key) => {
            return {
              user: key,
              score: newDrillAttempts[key],
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
    (a, b) => a[1] - b[1],
  );

  const getUserInfo = (userId) => {
    return userInfo[userId] || { name: "Unknown", uid: "unknown" };
  };

  console.log(drillLeaderboardAttempts);

  return (
    <ScrollView>
      <List.Section>
        {orderedLeaderboard.map((user) => (
          <List.Item
            key={user.user}
            title={getUserInfo(user.user).name}
            left={() => <Avatar.Text size={24} label="XD" />}
            right={() => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text>{numTrunc(user.score)} ft</Text>
                <Icon source="chevron-right" />
              </View>
            )}
          />
        ))}
      </List.Section>
    </ScrollView>
  );
}
