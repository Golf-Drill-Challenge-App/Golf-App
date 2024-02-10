import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Text } from 'react-native-paper';
import { List } from 'react-native-paper';
import { Link } from 'expo-router';

import drillsData from '~/drills.json'

//This is for the list of drills
export default function Index() {
    const drills = drillsData.drills;

    return (
        <PaperProvider>
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Link href={{
                    pathname: "/"
                }}>
                    Go back to Index
                </Link>
                <Text>Drill Index</Text>
                <List.Section>
                    <List.Subheader>Drills</List.Subheader>
                    {drills.map((drill) => (
                        <Link
                            key={drill.did}
                            href={{
                                pathname: `/drill/${drill.did}`, 
                                params: { id: drill.did },
                            }}
                            style={{ paddingVertical: 8 }}
                        >
                            <List.Item title={drill.drillType} description={drill.description} />
                        </Link>
                    ))}
                </List.Section>

            </SafeAreaView>
        </PaperProvider>
    );
}