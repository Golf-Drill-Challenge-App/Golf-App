import * as React from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { PaperProvider, Text, Avatar, Button, Card, Appbar } from "react-native-paper";
import { TouchableOpacity } from 'react-native';
import { FlatList, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View } from 'react-native';
import { useNavigation } from 'expo-router';
import { Link } from 'expo-router';
import drillsData from "~/drill_data.json";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "~/firebaseConfig";
import { useEffect } from 'react';

const LeftContent = props => <Avatar.Icon {...props} icon="check-bold" color='green' back />;
const assignedData = [

  {
    "pid": "1",
    "title": "Task 1",
    "description": "Laborum velit duis consequat pariatur velit laborum est sunt non. Anim do sunt amet magna fugiat. Esse aliquip id id voluptate velit deserunt Lorem adipisicing cillum quis reprehenderit tempor et Lorem et. Nostrud ut elit id irure nisi ipsum adipisicing eiusmod excepteur quis anim est labore.",
    "assigned_time": "2345654",
    "drills": ["YtCsaxzscFScnpZYmnKI", "SpvYyY94HaulVH2zmVyM"],
    "assignee": [{ "uid": "4", "completed": ["YtCsaxzscFScnpZYmnKI"] }, { "uid": "5", "completed": ["SpvYyY94HaulVH2zmVyM"] }]
  },

];


const cardData = [
  // ... your array of card data objects here ...
  { did: "SpvYyY94HaulVH2zmVyM", drillType: "20 Shot Challenge", spec: "50ft - 150ft" },
  { did: "YtCsaxzscFScnpZYmnKI", drillType: "Line Test", spec: "7 - PW" },
  { did: "SpvYyY94HaulVH2zmVyM", drillType: "20 Shot Challenge", spec: "50ft - 150ft" },
  { did: "SpvYyY94HaulVH2zmVyM", drillType: "20 Shot Challenge", spec: "50ft - 150ft" },
  { did: "SpvYyY94HaulVH2zmVyM", drillType: "20 Shot Challenge", spec: "50ft - 150ft" },
  { did: "SpvYyY94HaulVH2zmVyM", drillType: "20 Shot Challenge", spec: "50ft - 150ft" },
  { did: "SpvYyY94HaulVH2zmVyM", drillType: "20 Shot Challenge", spec: "50ft - 150ft" },
  { did: "SpvYyY94HaulVH2zmVyM", drillType: "20 Shot Challengeeeeeeeeeeee", spec: "50ft - 150ft" },
  { did: "SpvYyY94HaulVH2zmVyM", drillType: "20 Shot Challenge", spec: "50ft - 150ft" },
  { did: "SpvYyY94HaulVH2zmVyM", drillType: "20 Shot Challenge", spec: "50ft - 150ft" },
  // ... more car
];

function MyComponent(props) {
  const drillsRef = collection(db, "teams", "1", "drills");
  //const test = doc(db, "teams", "1", "drills", "SpvYyY94HaulVH2zmVyM")
  //console.log("GET TEST", test)

  //getDocs(drillsRef).then(q => q.forEach(d => console.log("DOC DATA", d.data())))




  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      style={styles.row}
      horizontal={true}
      data={props.cardData}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (


        <Link
          key={'732489'}
          href={{
            pathname: `/content/drill/${item.did}`,
            params: { id: item.did },
          }}
          style={{ paddingLeft: 10 }}
          disabled={assignedData[0].assignee[0].completed == item.did}
        >
          <Card style={{ width: 150, height: 150, paddingLeft: 10, backgroundColor: assignedData[0].assignee[0].completed == item.did ? 'green' : 'white' }}>
            <Card.Content>
              <Text variant="titleLarge" numberOfLines={3}>{item.drillType}</Text>
              <Text variant="bodyMedium">{item.spec}</Text>
            </Card.Content>
          </Card>
        </Link>


      )}
    />


  );
}

const styles = StyleSheet.create({

  row: {
    maxHeight: 190,
    marginBottom: 20,
    paddingTop: 10

  },
  card: {
    width: 150, // Adjust card width
    height: 150, // Adjust card height
    margin: 10, // Add spacing between cards
    marginBottom: 20
  },
  drillListTitle: {
    fontWeight: 'bold',
    fontSize: 20
  }
});

export default function Index() {
  const d = doc(db, "teams", "1", "drills", "SpvYyY94HaulVH2zmVyM")
  //getDoc(d).then(value => console.log(value.data()));

  const [cardDataTest, setCardDataTest] = React.useState([])
  useEffect(() => {
    let drillList = [];
    let promiseList = [];
    assignedData.forEach(assignemnt => {
      assignemnt.drills.forEach(did => {
        promiseList.push(getDoc(doc(db, "teams", "1", "drills", did)))
      })
    })
    Promise.all(promiseList).then((values) => {
      values.forEach((drillData => {

        console.log("DRILL DATA", drillData.data());
        drillList.push(drillData.data())
      }))
      setCardDataTest(drillList)
    })

  }, [])
  console.log("TEST CARD DATA", cardDataTest)

  const navigation = useNavigation();


  const drill_ids = assignedData[0].drills


  return (
    <PaperProvider>
      <SafeAreaView
        style={{ flex: 1 }}
        edges={["right", "top", "left"]}
      >
        <Appbar.Header statusBarHeight={0} style={{ backgroundColor: "FFF" }}>

          <Appbar.Content title={"Dashboard"} titleStyle={{ fontWeight: 'bold' }} />
        </Appbar.Header>



        <Text style={styles.drillListTitle}>Todays Drills</Text>
        {(cardDataTest.length != 0) ? <MyComponent cardData={cardDataTest} /> : <Text>Loading</Text>}
        <Text style={styles.drillListTitle}>Pinned Drills</Text>
        <MyComponent cardData={cardData} />
      </SafeAreaView>
    </PaperProvider>
  );
}
