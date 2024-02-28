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

const LeftContent = props => <Avatar.Icon {...props} icon="check-bold" color='green' back />;
const cardData = [
  // ... your array of card data objects here ...
  { id: 1, title: "20 Shot Challenge", description: "50ft - 150ft" },
  { id: 2, title: "20 Shot Challenge", description: "50ft - 150ft" },
  { id: 3, title: "20 Shot Challenge", description: "50ft - 150ft" },
  { id: 4, title: "20 Shot Challenge", description: "50ft - 150ft" },
  { id: 5, title: "20 Shot Challenge", description: "50ft - 150ft" },
  { id: 6, title: "20 Shot Challenge", description: "50ft - 150ft" },
  { id: 7, title: "20 Shot Challenge", description: "50ft - 150ft" },
  { id: 8, title: "20 Shot Challenge", description: "50ft - 150ft" },
  { id: 9, title: "20 Shot Challenge", description: "50ft - 150ft" },
  { id: 10, title: "20 Shot Challenge", description: "50ft - 150ft" },
  // ... more card data ...
];


function MyComponent() {
  const drills = drillsData.teams["1"].drills

  const navigation = useNavigation();
  const handleCardClick = (item) => {
    // Perform your desired action on card click
    console.log('Card clicked:', item);
  };

  return (

    <FlatList
      showsHorizontalScrollIndicator={false}
      style={styles.row}
      horizontal={true}
      data={cardData.slice(0, 5)} // First 5 cards for first row
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (

        <TouchableOpacity onPress={() => handleCardClick(item)}>
          <Link
            key={'732489'}
            href={{
              pathname: `/content/drill/732489`,
              params: { id: '732489' },
            }}
            style={{ paddingVertical: 8 }}
          >
            <Card style={styles.card}>
              <Card.Content>
                <Text variant="titleLarge" numberOfLines={2}>{item.title}</Text>
                <Text variant="bodyMedium">{item.description}</Text>
              </Card.Content>
            </Card>
          </Link>
        </TouchableOpacity>

      )}
    />


  );
}

const styles = StyleSheet.create({

  row: {
    maxHeight: 190,
    marginBottom: 20
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


  const HandleClick = () => {
    console.log("Clicked Plan Index");
  };
  const navigation = useNavigation();
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
        <MyComponent cardData={cardData} />
        <Text style={styles.drillListTitle}>Pinned Drills</Text>
        <MyComponent cardData={cardData} />
      </SafeAreaView>
    </PaperProvider>
  );
}
