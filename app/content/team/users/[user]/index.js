import React from "react";
import drillData from "~/drill_data.json";
import ProfileCard from "~/components/profileCard";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import DrillCard from "~/components/drillCard";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaperProvider, Appbar } from "react-native-paper";

function Index(props) {
  const { user: user_id } = useLocalSearchParams();
  const userData = drillData["teams"]["1"]["users"][user_id];
  const drills = drillData["teams"]["1"]["drills"];
  const navigation = useNavigation();
  console.log(userData);
  const attemptedDrills = userData["history"]
    ? Object.keys(drills).filter((drillId) => drillId in userData["history"])
    : [];

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
          <Appbar.Content title={userData["name"]+"'s Profile"} />
        </Appbar.Header>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.profileContainer}>
            <ProfileCard user={userData} />
          </View>

          <Text style={styles.heading}>Drills</Text>

          {userData["history"] ? (
            attemptedDrills.map((drillId) => (
              <DrillCard
                drill={drills[drillId]}
                hrefString={
                  "/content/team/users/" + userData.uid + "/drills/" + drillId
                }
                key={drillId}
              />
            ))
          ) : (
            <Text style={styles.noDrillsText}>No drills attempted yet</Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 4,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  noDrillsText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    color: "gray",
  },
});

export default Index;
