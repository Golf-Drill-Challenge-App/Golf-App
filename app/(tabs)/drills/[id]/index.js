import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { db } from "../../../../firebaseConfig";

export default function Index() {
  // references: https://github.com/efmmoncada/golf-drill-challenge-app/blob/e135f22afef919adceb278d4cb346d606dcba738/src/components/Drill.jsx#L27
  // https://firebase.google.com/docs/firestore/query-data/get-data
  // https://tanstack.com/query/v4/docs/react/guides/queries

  const { id } = useLocalSearchParams(); // https://docs.expo.dev/router/reference/search-parameters/

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["drill", id],
    queryFn: async () => {
      const data = await getDoc(doc(db, "testdrills", id));
      if (!data.exists()) throw new Error("Could not fetch data");
      return data.data();
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

  console.log("Single Drill Data");
  console.log(data);
  let drillData = data;

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text
        style={{
          marginHorizontal: 40,
          marginTop: 20,
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        Drill ID: {id}
      </Text>
      <Text style={{ marginHorizontal: 40, marginTop: 20, fontSize: 20 }}>
        Drill Type: {drillData.drillType}
      </Text>
      <Text style={{ marginHorizontal: 40, marginTop: 20, fontSize: 20 }}>
        Drill Random Distance Range: {drillData.spec}
      </Text>
      <Text style={{ marginHorizontal: 40, marginTop: 20, fontSize: 20 }}>
        Drill Shot Type: {drillData.shotType}
      </Text>
      <Text style={{ marginHorizontal: 40, marginTop: 20, fontSize: 20 }}>
        Drill Description: {drillData.description}
      </Text>
      <Text style={{ marginHorizontal: 40, marginTop: 20, fontSize: 20 }}>
        Drill Inputs: {drillData.inputs.join(", ")}
      </Text>
      <Text style={{ marginHorizontal: 40, marginTop: 20, fontSize: 20 }}>
        Drill Reps: {drillData.reps}
      </Text>
      <Link
        href={"drills/" + id + "/input"}
        style={{
          marginHorizontal: 40,
          marginTop: 20,
          fontSize: 20,
          color: "#0000FF",
        }}
      >
        {drillData.drillType} Input Page (test)
      </Link>
      <Link
        href="drills"
        style={{
          marginHorizontal: 40,
          marginTop: 20,
          fontSize: 20,
          color: "#0000FF",
        }}
      >
        Go back to Drill Home Page
      </Link>
    </SafeAreaView>
  );
}
