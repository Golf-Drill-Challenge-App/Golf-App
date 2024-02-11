import React from 'react';
import { View, StatusBar } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Text } from 'react-native-paper';
import { Link } from "expo-router";

// import Leaderboard from './drills/leaderboard'
// import Description from './drills/description'
// import Stat from './drills/stat'

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
                <Text>Open up App.js to start working on your app!</Text>
                <Text>----</Text>
                <Text>Hide Tabbar</Text>
                <Link href={{
                    pathname: "/drill/fdsfds/submission"
                }}>
                    Go to /drill/[id]/submission
                </Link>
                <Link href={{
                    pathname: "/drill/fdsfds/users/sdfd"
                }}>
                    Go to /drill/[id]/users/[user]
                </Link>
                <Text>----</Text>
                <Text>Show Tabbar</Text>
                <Link href={{
                    pathname: "/drill"
                }}>
                    Go to /drill
                </Link>
                <Link href={{
                    pathname: "/drill/fdsfds/leaderboard"
                }}>
                    Go to /drill/[id]/leaderboard
                </Link>
                <Link href={{
                    pathname: "/team"
                }}>
                    Go to /team
                </Link>
                <Link href={{
                    pathname: "/team/users/abc"
                }}>
                    Go to /team/users/[user]
                </Link>
                <Link href={{
                    pathname: "/team/users/abc/drills/123"
                }}>
                    Go to /team/users/[user]/drills/[id]
                </Link>
            </SafeAreaView>
        </PaperProvider>
    );
}