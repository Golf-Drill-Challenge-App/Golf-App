import { Tabs } from "expo-router";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
export default () => {
    return <Tabs>
        <Tabs.Screen
            name="PlanScreen"
            options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    return <Icon name="collage" size={size} color={color} />;
                },
            }}
        />
        <Tabs.Screen
            name="DrillScreen"
            options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    return <Icon name="golf" size={size} color={color} />;
                },
            }}
        />
        <Tabs.Screen
            name="TeamScreen"
            options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    return <Icon name="account-group-outline" size={size} color={color} />;
                },
            }}
        />
        <Tabs.Screen
            name="ProfileScreen"
            options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    return <Icon name="account-circle" size={size} color={color} />;
                },

            }}
        />
    </Tabs>
}