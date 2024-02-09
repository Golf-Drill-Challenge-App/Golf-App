import React from 'react';
import { View, StatusBar } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Text } from 'react-native-paper';
import { Link } from "expo-router";

import Leaderboard from './(content)/drill/[id]/leaderboard.js'
import Description from './(content)/drill/[id]/description.js'
import Stat from './(content)/drill/[id]/statistics.js'

export default function Index() {
    const [value, setValue] = React.useState("description");

    const tabComponent = () => {
        switch (value) {
            case 'leaderboard':
                return <Leaderboard />
            case 'description':
                return <Description />
            case 'stats':
                return <Stat />
        }
    }

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
                    pathname: "/drill/1234/statistics"
                }}>
                    Go to Stats at /drill/1234/statistics
                </Link>
                <Link href={{
                pathname: "/drill/1234/submission/"
            }}>
                Go to Result at /drill/1234/submission/
            </Link>
            </SafeAreaView>
        </PaperProvider>
    );
}