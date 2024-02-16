import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Text } from 'react-native-paper';
import { Link } from "expo-router";
export default function Index() {
    return (
        <PaperProvider>
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ alignItems: 'center' }}>Use the links below to test different screen prototypes:{"\n\n"}</Text>
                <Link href={{
                    pathname: "/drill"
                }}>
                    Go to Drills List
                </Link>
                <Link href={{
                    pathname: "/drill/732489/statistics"
                }}>
                    Go to Stats at /drill/732489/statistics
                </Link>
                <Link href={{
                    pathname: "/drill/732489/submission/"
                }}>
                    Go to Result at /drill/732489/submission/
                </Link>
            </SafeAreaView>
        </PaperProvider>
    );
}
