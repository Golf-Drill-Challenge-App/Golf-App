import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Text } from 'react-native-paper';
import Result from "./result";
import drillData from "~/drill_data.json"

export default function Index() {
    const data = drillData[0]
    return (
        <PaperProvider>
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Submission</Text>
                <Result submission={data}/>

            </SafeAreaView>
        </PaperProvider>
    );
}