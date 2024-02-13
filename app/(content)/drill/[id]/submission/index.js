import React from 'react';
import { useNavigation } from 'expo-router';
import { Appbar, PaperProvider, Text } from 'react-native-paper';
import Result from "./result";
import drillData from "~/drill_data.json"

export default function Index(props) {
    const navigation = useNavigation();
    const data = drillData[0]
    
    return (
        <PaperProvider>
            <Appbar.Header statusBarHeight={0}>
                <Appbar.BackAction onPress={() => { navigation.goBack() }} color={"#F24E1E"} />
                <Appbar.Content title={ /*props.drill*/ "20 Shot Challenge" } />
            </Appbar.Header>

            <Result submission={data} />
            
        </PaperProvider>
    );
}