import React from "react";
import { PaperProvider, Text, MD3LightTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { db } from "../../firebaseConfig";

export default function Drills() {
  // const id = "9Ih1Msl26JrhDfjfool7";

  // references: https://github.com/efmmoncada/golf-drill-challenge-app/blob/e135f22afef919adceb278d4cb346d606dcba738/src/components/Drill.jsx#L27
  // https://firebase.google.com/docs/firestore/manage-data/add-data
  // https://tanstack.com/query/v4/docs/react/guides/queries

  const data = useQuery({
    queryKey: ["drill"],
    queryFn: async () => {
      const data = await getDocs(collection(db, "drills"));
      data.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
      });
      if (!data.exists()) throw new Error("Could not fetch data");
      return data.data();
    },
  });

  console.log(data);

  return (
    <PaperProvider theme={MD3LightTheme}>
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Open up App.js to start working on your app!</Text>
        <Link href="/">Go back to Index</Link>
      </SafeAreaView>
    </PaperProvider>
  );
}