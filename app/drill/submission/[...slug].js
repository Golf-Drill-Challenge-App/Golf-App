import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Text } from 'react-native-paper';
import {Link, useLocalSearchParams} from "expo-router";

export default function Index() {
    const { slug } = useLocalSearchParams();
    return (
        <PaperProvider>
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Submission Slug: {slug}</Text>

            </SafeAreaView>
        </PaperProvider>
    );
}