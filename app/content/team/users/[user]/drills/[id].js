import { useLocalSearchParams, useNavigation } from "expo-router";

import { Appbar, PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import BarChartScreen from "~/components/barChart";
import { db } from "~/firebaseConfig";

export default function Stat() {
  const navigation = useNavigation();
  const { user: userId, id: drillId } = useLocalSearchParams();
  console.log("user_id: ", userId, "drill_id: ", drillId);

  const [drillAttempts, setDrillAttempts] = useState([]);
  const [drillInfo, setDrillInfo] = useState({});

  useEffect(() => {
    // massive data fetching on refresh. May or may not get its data from cache
    getDoc(doc(db, "teams", "1", "drills", drillId)).then((doc) => {
      // get drill data
      if (doc.exists()) {
        setDrillInfo(doc.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    });
    getDocs(
      query(
        collection(db, "teams", "1", "attempts"),
        where("did", "==", drillId),
        where("uid", "==", userId),
      ),
    )
      .then((querySnapshot) => {
        // get all attempts in drill and filter only the highest score for a user
        let newDrillAttempts = [];
        querySnapshot.forEach((doc) => newDrillAttempts.push(doc.data()));
        setDrillAttempts(newDrillAttempts);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
    return () => {};
  }, []);
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
          <Appbar.Content title={"Statistics"} />
        </Appbar.Header>

        <BarChartScreen drillData={drillAttempts} drillInfo={drillInfo} />
      </SafeAreaView>
    </PaperProvider>
  );
}
