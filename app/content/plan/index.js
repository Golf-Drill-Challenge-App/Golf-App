import React, { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { PaperProvider, Text, Avatar, Button, Card, Appbar } from "react-native-paper";
import { TouchableOpacity } from 'react-native';
import { FlatList, StyleSheet, ScrollView } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View } from 'react-native';
import { useNavigation, router } from 'expo-router';
import { Link } from 'expo-router';
import drillsData from "~/drill_data.json";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "~/firebaseConfig";
import { useEffect } from 'react';

import { formatDate } from '~/Utility'

const assignedData = [
  { "drill": "YtCsaxzscFScnpZYmnKI", "assigned_time": "1710522958", "completed": false },
  { "drill": "YtCsaxzscFScnpZYmnKI", "assigned_time": "1710464940", "completed": false },
  { "drill": "SpvYyY94HaulVH2zmVyM", "assigned_time": "1710464941", "completed": false },
  { "drill": "SpvYyY94HaulVH2zmVyM", "assigned_time": "1710292142", "completed": true },
  { "drill": "SpvYyY94HaulVH2zmVyM", "assigned_time": "1710292143", "completed": false },
  { "drill": "SpvYyY94HaulVH2zmVyM", "assigned_time": "1710292144", "completed": false },
  { "drill": "SpvYyY94HaulVH2zmVyM", "assigned_time": "1710205745", "completed": true },
  { "drill": "SpvYyY94HaulVH2zmVyM", "assigned_time": "1710205746", "completed": false },
  { "drill": "SpvYyY94HaulVH2zmVyM", "assigned_time": "1710032940", "completed": false },
  { "drill": "SpvYyY94HaulVH2zmVyM", "assigned_time": "1710032941", "completed": false },
  { "drill": "SpvYyY94HaulVH2zmVyM", "assigned_time": "1710012941", "completed": false },
]

const drillData = {
  "YtCsaxzscFScnpZYmnKI": { "name": "Line Test", "type": "100-150" },
  "SpvYyY94HaulVH2zmVyM": { "name": "Putt test", "type": "On the green" },
}


const DrillList = () => {
  const [assignedData, setAssignedData] = useState([]); // Assuming assignedData is an array

  useEffect(() => {
    const assignedData = [
      { "drill": "YtCsaxzscFScnpZYmnKI", "assigned_time": "1710522958", "completed": false },
      { "drill": "YtCsaxzscFScnpZYmnKI", "assigned_time": "1710464940", "completed": false },
      { "drill": "SpvYyY94HaulVH2zmVyM", "assigned_time": "1710464941", "completed": false },
      { "drill": "SpvYyY94HaulVH2zmVyM", "assigned_time": "1710292142", "completed": true },
      { "drill": "SpvYyY94HaulVH2zmVyM", "assigned_time": "1710292143", "completed": false },
      { "drill": "SpvYyY94HaulVH2zmVyM", "assigned_time": "1710292144", "completed": false },
      { "drill": "SpvYyY94HaulVH2zmVyM", "assigned_time": "1710205745", "completed": true },
      { "drill": "SpvYyY94HaulVH2zmVyM", "assigned_time": "1710205746", "completed": false },
      { "drill": "SpvYyY94HaulVH2zmVyM", "assigned_time": "1710032940", "completed": false },
      { "drill": "SpvYyY94HaulVH2zmVyM", "assigned_time": "1710032941", "completed": false },
      { "drill": "SpvYyY94HaulVH2zmVyM", "assigned_time": "1710012940", "completed": false },
    ]
    setAssignedData(assignedData);
  }, [])


  const navigation = useNavigation();
  const groupedData = assignedData.reduce((acc, curr) => {
    const date = convertTimestampToDate(curr.assigned_time);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(curr);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedData).sort((a, b) => new Date(b) - new Date(a));
  const today = convertTimestampToDate(Date.now() / 1000)
  console.log("TODAY", convertTimestampToDate(Date.now() / 1000))


  const handleDrillClick = (drill) => {
    // Create a new copy of the assignedData array
    const updatedData = assignedData.map((item) => {
      if (item.drill === drill.drill && item.assigned_time === drill.assigned_time) {
        // Update the completed property for the clicked drill
        return { ...item, completed: true };
      }
      return item;
    });

    // Update the state with the new array
    setAssignedData(updatedData);
  };

  console.log(groupedData)
  return (
    <FlatList
      data={sortedDates}
      keyExtractor={(date) => date}
      renderItem={({ item: date }) => (
        <View>
          <Text style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center' }}>
            {date === today ? 'Today' : date}
          </Text>
          {groupedData[date].map((drill) => (
            <TouchableOpacity disabled={drill.completed} onPress={() => { handleDrillClick(drill); router.push({ pathname: `content/drill/${drill.drill}`, params: { id: `${drill.drill}` } }) }}>
              <View key={drill.assigned_time} style={{ marginLeft: 20, marginRight: 20 }}>


                <View style={{
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
                  flexDirection: 'row' // Add this line
                }}>
                  <Text style={{ fontSize: 20 }}>{drillData[drill.drill].name}</Text>
                  <Text style={{ fontSize: 20 }}>{drillData[drill.drill].type}</Text>
                </View>

              </View>
            </TouchableOpacity>



          ))}
        </View >
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
    /*Object.values(assignedData).forEach((data) => {
      data.drill = getDoc(doc(db, "teams", "1", "drills", data.drill)).then(drillData => (
        drillData.data()
      ))
    });
    console.log("DRILL LIST", drillList)
    Object.values(assignedData).forEach((data) => {
      console.log("DATA", data)
      drillList.push(data.drill);
    });*/

    /* assignedData.drills.forEach(did => {
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
  const navigation = useNavigation();



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
