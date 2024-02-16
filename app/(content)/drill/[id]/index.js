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
    const drillData = drillsData.teams["1"].drills[id] ? drillsData.teams["1"].drills[id] : null;

    const findDrillAttempts = () => {
        const drillAttempts = [];
        const team = drillsData.teams["1"];
        Object.values(team.users).forEach(user => {
            Object.values(user.history).forEach(drill => {
                if (Object.keys(user.history).includes(id)) {
                    drill.forEach(attempt => {
                        if (drillAttempts.length === 0) {
                            drillAttempts.push({
                                attempts: [
                                    attempt.averageProximity,
                                ],
                                totalSubmissions: 1,
                                userId: user.uid
                            });
                        }
                        else {
                            var userIdx = -1;
                            for (let i = 0; i < drillAttempts.length; i++) {
                                if (drillAttempts[i].userId === user.uid) {
                                    userIdx = i;
                                    break;
                                }
                            }

                            if (userIdx >= 0) {
                                drillAttempts[userIdx].attempts.push(attempt.averageProximity);
                                drillAttempts[userIdx].totalSubmissions++;
                            }
                            else {
                                drillAttempts.push({
                                    attempts: [
                                        attempt.averageProximity,
                                    ],
                                    totalSubmissions: 1,
                                    userId: user.uid
                                });
                            }
                        }
                    })
                }
            })
        });

        return drillAttempts;
    }
    
    const drillLeaderboardAttempts = findDrillAttempts();

    console.log("Attempts: ", drillLeaderboardAttempts)

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