import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Appbar, PaperProvider, Text, List } from 'react-native-paper';
import { Link, useNavigation } from 'expo-router';

import drillsData from '~/drills.json';

export default function Index() {
    const drills = drillsData.teams["1"].drills;
    const navigation = useNavigation();

    return (
        <PaperProvider>
            <Appbar.Header statusBarHeight={0}>
                <Appbar.BackAction onPress={() => { navigation.goBack() }} color={"#F24E1E"} />
                <Appbar.Content title="Drills" />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.scrollView}>
                <List.Section>
                    {Object.values(drills).map((drill) => (
                        <Link
                            key={drill.did}
                            href={{
                                pathname: `/drill/${drill.did}`,
                                params: { id: drill.did },
                            }}
                            style={{ paddingVertical: 8 }}
                        >
                            <List.Item
                                title={drill.drillType}
                                description={drill.description}
                                titleStyle={styles.title}
                                descriptionStyle={styles.description}
                                left={() => <List.Icon icon="file-document-outline" /*TODO: pick a better icon*/ />}
                                style={styles.item}
                            />
                        </Link>
                    ))}
                </List.Section>
            </ScrollView>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        color: '#555',
    },
    item: {
        borderBottomWidth: 1,       // Add bottom border
        borderBottomColor: '#ccc',  // Grey color
    },
});
