import React from "react";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { db } from "../../../firebaseConfig";

export default function Index() {
  // references: https://github.com/efmmoncada/golf-drill-challenge-app/blob/e135f22afef919adceb278d4cb346d606dcba738/src/components/Drill.jsx#L27
  // https://firebase.google.com/docs/firestore/query-data/get-data
  // https://tanstack.com/query/v4/docs/react/guides/queries

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["drill"],
    queryFn: async () => {
      const collectionData = await getDocs(collection(db, "testdrills"));
      let dataArr = [];
      collectionData.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        dataArr.push({ id: doc.id, ...doc.data() }); // https://stackoverflow.com/a/61358570
      });
      return dataArr;
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text style={{ fontSize: 20 }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Error: {error.message}</Text>
      </SafeAreaView>
    );
  }

  console.log("All Drills Data");
  console.log(data);
  let drillCollectionData = data;

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Drills Home Page</Text>
      {drillCollectionData.map((drillData) => (
        <Link
          href={"drills/" + drillData.id} // See here for alternate syntax: https://docs.expo.dev/router/navigating-pages/#linking-to-dynamic-routes
          style={{
            marginHorizontal: 40,
            marginTop: 20,
            fontSize: 20,
            color: "#0000FF",
          }}
          key={drillData.id}
        >
          {drillData.drillType}
        </Link>
      ))}
      <Link
        href="/"
        style={{
          marginHorizontal: 40,
          marginTop: 20,
          fontSize: 20,
          color: "#0000FF",
        }}
      >
        Go back to Home Page
      </Link>
    </SafeAreaView>
  );
}
