import { Tabs } from "expo-router";
import { Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { themeColors } from "~/Constants";

export default () => {
  return (
    <Tabs
      options={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="assignments"
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Icon
                name="collage"
                size={size}
                color={focused ? themeColors.accent : color}
              />
            );
          },
          tabBarLabel: ({ color, focused }) => (
            <Text style={tabBarStyle(color, focused)}>Assignments</Text>
          ),
          tabBarHideOnKeyboard: true,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="drill"
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Icon
                name="golf"
                size={size}
                color={focused ? themeColors.accent : color}
              />
            );
          },
          tabBarLabel: ({ color, focused }) => (
            <Text style={tabBarStyle(color, focused)}>Drills</Text>
          ),
          tabBarHideOnKeyboard: true,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="team"
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Icon
                name="account-group-outline"
                size={size}
                color={focused ? themeColors.accent : color}
              />
            );
          },
          tabBarLabel: ({ color, focused }) => (
            <Text style={tabBarStyle(color, focused)}>Team</Text>
          ),
          tabBarHideOnKeyboard: true,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Icon
                name="account-circle"
                size={size}
                color={focused ? themeColors.accent : color}
              />
            );
          },
          tabBarLabel: ({ color, focused }) => (
            <Text style={tabBarStyle(color, focused)}>Profile</Text>
          ),
          tabBarHideOnKeyboard: true,
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

const tabBarStyle = (color, focused) => {
  return {
    color: focused ? themeColors.accent : color,
    fontSize: 12,
  };
};
