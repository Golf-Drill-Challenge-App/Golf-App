import React from 'react';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { Appbar, PaperProvider, Text } from 'react-native-paper';
import Result from "./result";
//import drillsData from "~/drills.json"

import drills from '~/drill_data.json'

export default function Index(props) {
    const navigation = useNavigation();
    const { id } = useLocalSearchParams();
    //const drillData = drillsData.teams["1"].users["1"].history[id][0];

    const drill = drills[0];
    
    return (
        <PaperProvider>
            <Appbar.Header statusBarHeight={0}>
                <Appbar.BackAction onPress={() => { navigation.goBack() }} color={"#F24E1E"} />
                <Appbar.Content title={ /*props.drill*/ "20 Shot Challenge" } />
            </Appbar.Header>

            <Result submission={drill} />
            
        </PaperProvider>
    );
}