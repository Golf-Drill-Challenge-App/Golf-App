import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Text } from 'react-native-paper';
import { Link, useFocusEffect, useNavigation } from 'expo-router';
import { Button } from 'react-native-paper';
//This is for the list of drills
export default function Index() {
    navigation = useNavigation()

    /*useFocusEffect(() => {
        navigation.getParent()?.setOptions({
            tabBarStyle: { display: 'flex' },
        });
    })*/

    return (
        <PaperProvider>
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Button
                    title="Go to Settings"
                    onPress={() => navigation.navigate('test')}
                >go to test main stack</Button>
                <Text>Profile Index</Text>
                <Link push href="content/profile/statistics">go to statistics</Link>
            </SafeAreaView>
        </PaperProvider>
    );
}