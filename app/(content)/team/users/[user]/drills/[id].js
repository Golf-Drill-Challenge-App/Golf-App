import React from 'react';
import { View, StatusBar } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Text } from 'react-native-paper';
import { Link } from "expo-router";

export default function Index() {

    return (
        <PaperProvider>
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Open up App.js to start working on your app!</Text>
                <Link href={{
                    pathname: "/"
                }}>
                    Go back to Index
                </Link>
            </SafeAreaView>
        </PaperProvider>
    );
}