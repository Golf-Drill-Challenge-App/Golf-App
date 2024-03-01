import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { CurrentUserContext } from "~/Contexts";
import BarChartScreen from "~/components/barChart";
import db from "~/firebaseConfig";

export default function Stat() {
  const drillId = useLocalSearchParams()["id"];
  const [drillInfo, setDrillInfo] = useState("");
  const [drillAttempts, setDrillAttempts] = useState([]);
  const userId = useContext(CurrentUserContext)["currentUser"];
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
  return <BarChartScreen drillData={drillAttempts} drillInfo={drillInfo} />;
}
