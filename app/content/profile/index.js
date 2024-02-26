import React from "react";
import drillData from "~/drill_data.json";
import ProfileCard from "~/components/profileCard";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";
import DrillCard from "~/components/drillCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaperProvider, Appbar } from "react-native-paper";

function Index(props) {
  const navigation = useNavigation();
  const user = drillData["teams"]["1"]["users"]["1"];
  const drills = drillData["teams"]["1"]["drills"];
  const attemptedDrills = user["history"]
    ? Object.keys(drills).filter((drillId) => drillId in user["history"])
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
          <Appbar.Content title={"Personal Profile"} />
          <Appbar.Action
            icon="cog"
            color={"#F24E1E"}
            onPress={() => {
              // Handle opening the edit modal
            }}
            style={{ marginRight: 7 }}
          />
        </Appbar.Header>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.profileContainer}>
            <ProfileCard user={user} />
          </View>

          <Text style={styles.heading}>Drill History</Text>

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
