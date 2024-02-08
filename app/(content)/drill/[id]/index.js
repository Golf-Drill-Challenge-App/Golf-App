import React from 'react';
import { PaperProvider, SegmentedButtons, Appbar } from 'react-native-paper';
import { useNavigation, useLocalSearchParams } from 'expo-router';

import Leaderboard from './leaderboard'
import Description from './description'
import Stat from './statistics'

import drillsData from '~/drills.json'

export default function Index() {
    const [value, setValue] = React.useState("description");
    const navigation = useNavigation();
    const { id } = useLocalSearchParams();

    const findDrillById = (drillId) => {
        return drillsData.teams[0].drills.find((drill) => drill.did === drillId);
    };

    const findDrillSubmissionsById = (drillId) => {
        const drillSubmissions = [];
        drillsData.teams[0].users.forEach(user => {
            user.history.forEach(drill => {
                if (Object.keys(drill).includes(drillId)) {
                    drill[drillId].forEach(attempt => {
                        if (attempt) {
                            drillSubmissions.push({
                                userId: user.uid,
                                time: attempt.time,
                                shots: attempt.shots
                            });
                        }
                    })
                }
            })
        });

        return drillSubmissions;
    }

    const drillData = findDrillById(id);
    const drillLeaderboardAttempts = findDrillSubmissionsById(id);

    const tabComponent = () => {
        switch (value) {
            case 'leaderboard':
                return <Leaderboard leaderboardData={drillLeaderboardAttempts} drillId={id} />
            case 'description':
                return <Description descData={drillData} drillId={id} />
            case 'stats':
                return <Stat />
        }
    }

    return (
        <PaperProvider>
            <Appbar.Header statusBarHeight={0}>
                <Appbar.BackAction onPress={() => { navigation.goBack() }} color={"#F24E1E"} />
                <Appbar.Content title={drillData.drillType} />
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

        </PaperProvider>
    );
}