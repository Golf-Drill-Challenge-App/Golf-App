
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, BottomNavigation } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CommonActions } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { styles } from '../../styles/style';
const Stack = createNativeStackNavigator();

export default function PlanScreenMain() {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator screenOptions={{
                headerShown: false,
            }}>
                <Stack.Screen
                    name="PlanScreen"
                    component={PlanScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="PlanScreen2" component={PlanScreen2} />
                <Stack.Screen name="PlanScreen3" component={PlanScreen3} />
            </Stack.Navigator>
        </NavigationContainer>
    )

}
function PlanScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text variant="headlineMedium">Plan!</Text>
            <Button
                title="Go to Plan 2"
                onPress={() => navigation.navigate(PlanScreen2)}
            />
        </View>
    );
}
function PlanScreen2({ navigation }) {
    return (
        <View style={styles.container}>
            <Text variant="headlineMedium">Plan2!</Text>
            <Button
                title="Go to Plan 3"
                onPress={() => navigation.navigate(PlanScreen3)}
            />

        </View>
    );
}
function PlanScreen3() {
    return (
        <View style={styles.container}>
            <Text variant="headlineMedium">Plan3!</Text>

        </View>
    );
}