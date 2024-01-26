import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Text } from 'react-native-paper';
import {Link, useLocalSearchParams} from "expo-router";

export default function Index() {
    const { slug } = useLocalSearchParams();
    return (
        <PaperProvider>
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Drill Slug: {slug}</Text>
                <Link href={"/drill/"}>/drill/</Link>
                <Link href={"/drill/submission/"}>/drill/submission</Link>
                <Link href={"/drill/submission/2345"}>/drill/submission/2345</Link>
                <Link href={"/drill/submission/1234,2345"}>/drill/submission/1234,2345 slug</Link>

            </SafeAreaView>
        </PaperProvider>
    );
}