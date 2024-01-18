import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Provider as PaperProvider, Text } from 'react-native-paper';
import NavigationBar from './NavigationBar';
import { NavigationContainer } from '@react-navigation/native';

export default function Index() {
    return (
        <PaperProvider>
            <NavigationContainer independent={true}>
                <NavigationBar />
            </NavigationContainer>

        </PaperProvider>
    );
}