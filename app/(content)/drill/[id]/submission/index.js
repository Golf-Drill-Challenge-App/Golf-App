import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Text } from 'react-native-paper';

export default function Index() {
    return (
        <PaperProvider>
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Submission</Text>

            </SafeAreaView>
        </PaperProvider>
    );
}