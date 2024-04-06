import React, { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { PaperProvider, Text, Avatar, Button, Card, Appbar } from "react-native-paper";
import { TouchableOpacity } from 'react-native';
import { FlatList, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View } from 'react-native';
import { useNavigation, router } from 'expo-router';
import { Link } from 'expo-router';
import drillsData from "~/drill_data.json";
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "~/firebaseConfig";
import { useEffect } from 'react';

import { formatDate, getUnique } from '~/Utility'
import { useDrillInfo } from "~/hooks/useDrillInfo";
import { useUserInfo } from "~/hooks/useUserInfo";
import Loading from "~/components/loading";
import { currentAuthContext } from "~/context/Auth";

import { useQueryClient } from '@tanstack/react-query';


const DrillList = () => {
  const queryClient = useQueryClient();
  const { currentUserId, currentTeamId } = currentAuthContext();
  const userId = currentUserId ?? null;
  const teamId = currentTeamId ?? null;

  console.log("USER ID IN PLAN", userId)

  const {
    data: drillInfo,
    error: drillInfoError,
    isLoading: drillInfoIsLoading,
  } = useDrillInfo();

  const {
    data: userData,
    userError: userError,
    userIsLoading: userIsLoading,
  } = useUserInfo(userId);

  const [assigned_data, setAssignedData] = useState([]);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    const refresh = async () => {
      setRefreshing(true);
      await queryClient.invalidateQueries(["user", { teamId, userId }]);
      setRefreshing(false);
    };

    refresh();
  }, [teamId, userId, queryClient]);


  console.log("USER DATA", userData);

  // Set the assigned_data state when the user data is loaded
  useEffect(() => {
    if (!userIsLoading && userData && userData.assigned_data) {
      setAssignedData(userData.assigned_data);
    }
  }, [userIsLoading, userData]);

  // Group the assigned drills by date
  const groupedData = assigned_data.reduce((acc, curr) => {
    const date = convertTimestampToDate(curr.assigned_time);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(curr);
    return acc;
  }, {});

  // Sort the dates in descending order
  const sortedDates = Object.keys(groupedData).sort((a, b) => new Date(b) - new Date(a));
  const today = convertTimestampToDate(Date.now() / 1000);

  // Update the completed property of the clicked drill


  // Render the list of drills
  return userIsLoading || drillInfoIsLoading ? (
    <Loading />
  ) : (
    <FlatList
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      data={sortedDates}
      keyExtractor={(date) => date}
      renderItem={({ item: date }) => (
        <View>
          <Text style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center' }}>
            {date === today ? 'Today' : date}
          </Text>
          {groupedData[date].map((drill) => (
            <TouchableOpacity
              disabled={drill.completed}
              onPress={() => {

                router.push({ pathname: `content/drill/${drill.drill}`, params: { id: `${drill.drill}`, assigned: drill.assigned_time } });
              }}
            >
              <View key={drill.assigned_time} style={{ marginLeft: 20, marginRight: 20 }}>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.2)',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    height: 50,
                    backgroundColor: `${!drill.completed ? '#fff' : 'green'}`,
                    borderRadius: 50,
                    marginBottom: 10,
                    paddingLeft: 30,
                    paddingRight: 30,
                    flexDirection: 'row',
                  }}
                >
                  <Text style={{ fontSize: 20 }}>{drillInfo[drill.drill]["drillType"]}</Text>
                  <Text style={{ fontSize: 20 }}>{drillInfo[drill.drill]["spec"]}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    />
  );
};

const convertTimestampToDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};






export default function Index() {
  const d = doc(db, "teams", "1", "drills", "SpvYyY94HaulVH2zmVyM")
  //getDoc(d).then(value => console.log(value.data()));

  const [cardDataTest, setCardDataTest] = React.useState([])
  useEffect(() => {
    let drillList = [];
    let promiseList = [];
    /*Object.values(assigned_data).forEach((data) => {
      data.drill = getDoc(doc(db, "teams", "1", "drills", data.drill)).then(drillData => (
        drillData.data()
      ))
    });
    console.log("DRILL LIST", drillList)
    Object.values(assigned_data).forEach((data) => {
      console.log("DATA", data)
      drillList.push(data.drill);
    });*/

    /* assigned_data.drills.forEach(did => {
       promiseList.push(
         getDoc(doc(db, "teams", "1", "drills", did)).then(drillData => (
           drillData.data()
         ))
       );
 
     });
 
     Promise.all(promiseList).then(values => {
       values.forEach((data) => {
         console.log("DRILL DATA", data);
         drillList.push(data);
       });
       setCardDataTest(drillList);
     });*/
  }, []);
  console.log("TEST CARD DATA", cardDataTest)
  console.log(formatDate(1710292140))


  return (
    <PaperProvider>
      <SafeAreaView
        style={{ flex: 1 }}
        edges={["right", "top", "left"]}
      >
        <Appbar.Header statusBarHeight={0} style={{ backgroundColor: "FFF" }}>

          <Appbar.Content title={"Plan"} titleStyle={{ fontWeight: 'bold' }} />
        </Appbar.Header>

        <DrillList></DrillList>

      </SafeAreaView>
    </PaperProvider>
  );
}
