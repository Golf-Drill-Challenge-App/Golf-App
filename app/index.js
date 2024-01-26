import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Text } from 'react-native-paper';
import {Link} from "expo-router";

//This is the root file
export default function Index() {
    return (
        <PaperProvider>
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Open up App.js to start working on your app!</Text>
                    <Link href={"/drill/"}>/drill/</Link>
                    <Link href={"/drill/1234"}>/drill/1234 slug</Link>
            </SafeAreaView>
        </PaperProvider>
    );
}