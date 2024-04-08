import React, { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { PaperProvider, Text, Avatar, Button, Card, Appbar, List } from "react-native-paper";
import { TouchableOpacity } from 'react-native';
import { FlatList, StyleSheet, ScrollView, RefreshControl, SectionList } from 'react-native';
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
  const { currentUserId, currentTeamId } = currentAuthContext();

  const {
    data: drillInfo,
    error: drillInfoError,
    isLoading: drillInfoIsLoading,
  } = useDrillInfo();

  const {
    data: userInfo,
    userError: userInfoError,
    userIsLoading: userIsLoading,
  } = useUserInfo(currentUserId);

  const queryClient = useQueryClient();

  const [assignedData, setAssignedData] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    const refresh = async () => {
      setRefreshing(true);
      await queryClient.invalidateQueries(["user", { teamId: currentTeamId, userId: currentUserId }]);
      setRefreshing(false);
    };
    refresh();
  }, [currentTeamId, currentUserId, queryClient]);

  console.log("USER DATA", userInfo);

  // Set the assigned_data state when the user data is loaded
  useEffect(() => {
    if (!userIsLoading && userInfo && userInfo.assigned_data) {
      setAssignedData(userInfo.assigned_data);
    }
  }, [userIsLoading, userInfo]);

  if (userIsLoading || drillInfoIsLoading) { return <Loading /> }


  const today = convertTimestampToDate(Date.now() / 1000);
  // Group the assigned drills by date
  const groupedData = assignedData.reduce((acc, curr) => {
    const date = convertTimestampToDate(curr.assignedTime);
    const dateKey = date === today ? "Today" : date;

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    if (curr.completed) {
      acc[dateKey].push(curr);
    }
    else {
      acc[dateKey].unshift(curr);
    }

    return acc;
  }, {});

  // Sort the dates in descending order
  const sortedDates = Object.keys(groupedData).sort((a, b) => new Date(b) - new Date(a));



  // Render the list of drills
  return sortedDates.length === 0 ? (
    <Text style={{ fontSize: 30, fontWeight: "bold", textAlign: "center" }}>
      No drills assigned
    </Text>
  ) : (
    <SectionList
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      sections={sortedDates.map((date) => ({
        title: date,
        data: groupedData[date],
      }))}
      keyExtractor={(item, index) => `${item.assignedTime}-${item.drillId}`}
      renderItem={({ item: assignment }) => (
        <TouchableOpacity
          key={`${assignment.assignedTime}-${assignment.drillId}`}
          disabled={assignment.completed}
          onPress={() => {
            router.push({
              pathname: `content/drill/${assignment.drillId}`,
              params: { id: `${assignment.drillId}`, assignedTime: assignment.assignedTime },
            });
          }}
        >
          <View style={{ marginLeft: 20, marginRight: 20 }}>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.2)',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                height: 65,
                backgroundColor: `${!assignment.completed ? '#fff' : '#89E894'}`,
                borderRadius: 20,
                marginBottom: 10,
                paddingLeft: 30,
                paddingRight: 30,
                paddingTop: 5,
                paddingBottom: 5,
              }}
            >
              <Text style={{ fontSize: 20 }}>{drillInfo[assignment.drillId]["prettyDrillType"]}</Text>
              <Text style={{ fontSize: 17, fontStyle: 'italic' }}>{drillInfo[assignment.drillId]["subType"]}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={{ fontSize: 25, fontWeight: "bold", textAlign: "center", marginTop: 10 }}>
          {title}
        </Text>
      )}
      stickySectionHeadersEnabled={false}
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



const CoachView = () => {
  const {
    data: drillInfo,
    error: drillInfoError,
    isLoading: drillInfoIsLoading,
  } = useDrillInfo();

  const [expanded, setExpanded] = React.useState(true);

  const handlePress = () => setExpanded(!expanded);
  if (drillInfoIsLoading) {
    return <Loading />;
  }
  return (
    <List.Section >
      <List.Accordion
        title="Select Drills"
        left={props => <List.Icon {...props} icon="folder" />}>
        {drillInfo && Object.values(drillInfo).map((drill) => (<List.Item title={drill.drillType} />))}

      </List.Accordion>


    </List.Section>
  );
};


export default function Index() {
  const { data: userInfo, userIsLoading, userError } = useUserInfo();


  console.log("USER INFO IN PLAN BEGGINING", userInfo)
  return (
    <PaperProvider>
      <SafeAreaView
        style={{ flex: 1 }}
        edges={["right", "top", "left"]}
      >
        <Appbar.Header statusBarHeight={0} style={{ backgroundColor: "FFF" }}>

          <Appbar.Content title={"Assigned Drills"} titleStyle={{}} />
        </Appbar.Header>

        <DrillList />

      </SafeAreaView>
    </PaperProvider>
  );
}
