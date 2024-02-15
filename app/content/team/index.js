import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Text } from 'react-native-paper';
import { Link } from 'expo-router';

//This is for the list of drills
export default function Index() {
    return (
        <PaperProvider>
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Team Index</Text>
            </SafeAreaView>
        </PaperProvider>
    );
}