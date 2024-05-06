import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { DefaultTheme, PaperProvider, Checkbox, Appbar } from "react-native-paper";
import { Text } from "react-native-paper";
import { List } from "react-native-paper";
import { useUserInfo } from "~/hooks/useUserInfo";
import { themeColors } from "~/Constants";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "~/components/header";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Loading from "~/components/loading";
import { Button } from "react-native-paper";
import { collection, doc, getDoc, setDoc, updateDoc, runTransaction } from "firebase/firestore";
import { db } from "~/firebaseConfig";
import { useQueryClient } from "@tanstack/react-query";




export default function Index() {

  console.log(id)
  const {
    data: userInfo,
    userError: userInfoError,
    userIsLoading: userIsLoading,
  } = useUserInfo();

  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  const queryClient = useQueryClient();
  const [checked, setChecked] = useState(false);
  const [outputData, setOutputData] = useState([]);
  const [toggleResult, setToggleResult] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  if (userIsLoading) {
    return <Loading />;
  }
  const handleAssignAll = () => {
    const updatedCheckedItems = {};
    Object.keys(userInfo).forEach((uid) => {
      updatedCheckedItems[uid] = true;
    });
    setCheckedItems(updatedCheckedItems);
  };
  const handlePress = async () => {
    const selectedUsers = Object.entries(checkedItems)
      .filter(([, value]) => value)
      .map((value) => value[0]);
    const time = new Date().getTime();
  
    const updatedUserIds = [];
   runTransaction(db, async (transaction) => { 
      const updatedAssignedData = {};

      for (const userId of selectedUsers) {
        const userRef = doc(db, "teams", "1", "users", userId);
        const docSnap = await transaction.get(userRef);
        if (docSnap.exists()) {
          const assignedData = docSnap.data()["assigned_data"];
          updatedAssignedData[userId] = [
            { assignedTime: time, completed: false, drillId: id },
            ...assignedData,
          ];
        } else {
          console.log("No such document!");
        }
      }
      selectedUsers.forEach((userId) => {
        const userRef = doc(db, "teams", "1", "users", userId);

        transaction.update(userRef, { assigned_data: updatedAssignedData[userId] });

      })
    }).then(()=>{

    // Invalidate cache after all users are updated
    selectedUsers.forEach((userId) =>
      queryClient.invalidateQueries(["user", { teamId: "1", userId }])
    );
    })
  
    navigation.pop(3)
  };
  console.log(checkedItems)
  return <PaperProvider theme={DefaultTheme}>
    <SafeAreaView style={{ flex: 1 }} edges={["right", "top", "left"]}>
      <Header
        title='assign drill'
        preChildren={
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack();
            }}
            color={themeColors.accent}
          />
        }
        postChildren={
          <Appbar.Action
            icon="check-all"
            onPress={handleAssignAll}
            color={themeColors.accent}
          />
        }
      />
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          {userIsLoading ? (
            <Text>Loading...</Text>
          ) : userInfoError ? (
            <Text>Error: {userInfoError.message}</Text>
          ) : (
            <List.Section
              style={{ paddingHorizontal: 20, height: "100%" }}
            >
              {Object.entries(userInfo).map(([uid, userData]) => (
                <TouchableOpacity key={uid} style={styles.cardContainer}
                  activeOpacity={.5}
                  onPress={() =>
                    setCheckedItems({
                      ...checkedItems,
                      [uid]: !checkedItems[uid],
                    })
                  }>
                  <View style={styles.cardContent}>
                    <Text style={styles.title}>{userData.name}</Text>
                    <View style={styles.specContainer}>
                      {checkedItems[uid] ? <Icon name="checkbox-outline" size={20} /> : <Icon name="checkbox-blank-outline" size={20} />}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </List.Section>
          )}
        </ScrollView>
        <Button
          style={{
            margin: 10,
            bottom: 20,
          }}
          mode="contained"
          buttonColor={themeColors.accent}
          textColor="white"
          onPress={handlePress}
        >
          Assign
        </Button>
      </View>
    </SafeAreaView>
  </PaperProvider>
}
const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 1,
    borderColor: themeColors.border,
    borderRadius: 8,
    marginVertical: 5,
    paddingHorizontal: 20,
    padding: 10, // Decrease the padding to make the height smaller
    backgroundColor: "#fff",
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    color: "#333",
  },
  specContainer: {
    flexDirection: "row", // Add flexDirection: 'row' to center the checkmark vertically
    alignItems: "center", // Add alignItems: 'center' to center the checkmark vertically
  },
  specText: {
    fontSize: 14,
    color: "#666",
  },
  inputText: {
    fontSize: 14,
    color: "#666",
  },
});