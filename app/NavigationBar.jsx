import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, BottomNavigation } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CommonActions } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PlanScreenMain from './components/PlanScreen';
import { styles } from './styles/style';
import ProfileScreen from './components/ProfileScreen';
import { DrillScreen } from './components/DrillScreen';
import TeamScreen from './components/TeamScreen';

const Tab = createBottomTabNavigator();

export default function NavigationBar() {
    return (
        <>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                }}
                tabBar={({ navigation, state, descriptors, insets }) => (
                    <BottomNavigation.Bar
                        navigationState={state}
                        safeAreaInsets={insets}
                        onTabPress={({ route, preventDefault }) => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (event.defaultPrevented) {
                                preventDefault();
                            } else {
                                navigation.dispatch({
                                    ...CommonActions.navigate(route.name, route.params),
                                    target: state.key,
                                });
                            }
                        }}
                        renderIcon={({ route, focused, color }) => {
                            const { options } = descriptors[route.key];
                            if (options.tabBarIcon) {
                                return options.tabBarIcon({ focused, color, size: 24 });
                            }

                            return null;
                        }}
                        getLabelText={({ route }) => {
                            const { options } = descriptors[route.key];
                            const label =
                                options.tabBarLabel !== undefined
                                    ? options.tabBarLabel
                                    : options.title !== undefined
                                        ? options.title
                                        : route.title;

                            return label;
                        }}
                    />
                )}
            >
                <Tab.Screen
                    name="Plan"
                    component={PlanScreenMain}
                    options={{
                        tabBarLabel: 'Plan',
                        tabBarIcon: ({ color, size }) => {
                            return <Icon name="collage" size={size} color={color} />;
                        },
                    }}
                />
                <Tab.Screen
                    name="Drills"
                    component={DrillScreen}
                    options={{
                        tabBarLabel: 'Drills',
                        tabBarIcon: ({ color, size }) => {
                            return <Icon name="golf" size={size} color={color} />;
                        },
                    }}
                />
                <Tab.Screen
                    name="Team"
                    component={TeamScreen}
                    options={{
                        tabBarLabel: 'Team',
                        tabBarIcon: ({ color, size }) => {
                            return <Icon name="account-group-outline" size={size} color={color} />;
                        },
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        tabBarLabel: 'Profile',
                        tabBarIcon: ({ color, size }) => {
                            return <Icon name="account-circle" size={size} color={color} />;
                        },
                    }}
                />

            </Tab.Navigator>
        </>
    );
}







