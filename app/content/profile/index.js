import { useNavigation } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Appbar, PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { CurrentUserContext } from "~/Contexts";
import DrillCard from "~/components/drillCard";
import ProfileCard from "~/components/profileCard";
import db from "~/firebaseConfig";

function Index(props) {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({});
  const userId = useContext(CurrentUserContext)["currentUser"];
  const [drills, setDrills] = useState({});

  useEffect(() => {
    let uniqueDrills = new Set();
    getDoc(doc(db, "teams", "1", "users", userId)).then((doc) => {
      setUserData(doc.data());
    });
    getDocs(
      query(collection(db, "teams", "1", "attempts")),
      where("uid", "==", userId),
    ).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        uniqueDrills.add(doc.data()["did"]);
      });
    });
    getDocs(
      query(collection(db, "teams", "1", "drills")),
      where("did", "in", uniqueDrills),
    ).then((querySnapshot) => {
      let newDrills = {};
      querySnapshot.forEach((doc) => {
        newDrills[doc.id] = doc.data();
      });
      setDrills(newDrills);
    });
  }, []);

  return (
    <PaperProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Appbar.Header statusBarHeight={0} style={{ backgroundColor: "FFF" }}>
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
            <ProfileCard user={userData} />
          </View>

          <Text style={styles.heading}>Drill History</Text>

          {Object.keys(drills).length > 0 ? (
            Object.keys(drills).map((drillId) => {
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
