import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Appbar, PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import DrillCard from "~/components/drillCard";
import ProfileCard from "~/components/profileCard";
import { db } from "~/firebaseConfig";
import { refToID } from "~/Utility";

function Index(props) {
  const user_id = useLocalSearchParams()["user"];
  const navigation = useNavigation();
  const [drills, setDrills] = useState({});
  const [userData, setUserData] = useState({});
  console.log("userData", userData);
  useEffect(() => {
    let uniqueDrills = new Set();
    getDoc(doc(db, "teams", "1", "users", user_id)).then((doc) => {
      setUserData(doc.data());
    });
    getDocs(
      query(collection(db, "teams", "1", "attempts")),
      where("uid", "==", user_id),
    ).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        uniqueDrills.add(doc.data()["did"]);
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
    });
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
          <Appbar.Content title={userData["name"] + "'s Profile"} />
        </Appbar.Header>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.profileContainer}>
            <ProfileCard user={userData} />
          </View>

          <Text style={styles.heading}>Drills</Text>

          {Object.keys(drills).length > 0 ? (
            Object.keys(drills).map((drillId) => (
              <DrillCard
                drill={drills[drillId]}
                hrefString={
                  "/content/team/users/" +
                  refToID(userData.uid) +
                  "/drills/" +
                  drillId
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
