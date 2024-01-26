import React from 'react';
import { View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Text, SegmentedButtons, Appbar } from 'react-native-paper';

import Leaderboard from './drills/leaderboard'
import Description from './drills/description'
import Stat from './drills/stat'

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
            {/*<SafeAreaView style={{ flex: 1 }}>*/}
                <Appbar.Header style={{  }} statusBarHeight={0}>
                    <Appbar.BackAction onPress={() => {  }} color={"#F24E1E"} />
                    <Appbar.Content title="20 Shot Challenge" />
                </Appbar.Header>

                {/* Tab system */}

                <SegmentedButtons
                    value={value}
                    onValueChange={setValue}
                    buttons={[
                        {
                            value: "description",
                            label: "Description",
                        },
                        {
                            value: "leaderboard",
                            label: "Leaderboard",
                        },
                        {
                            value: "stats",
                            label: "Stats",
                        },
                    ]}

                />

                {tabComponent()}

            {/*</SafeAreaView>*/}
        </PaperProvider>
    );
}