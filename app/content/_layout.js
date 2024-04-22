import { Tabs } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { themeColors } from "~/Constants";

export default () => {
  return (
    <Tabs
      options={{ headerShown: false }}
      screenOptions={{ tabBarActiveTintColor: themeColors.accent }}
    >
      <Tabs.Screen
        name="assignments"
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Icon name="collage" size={size} color={color} />;
          },
          tabBarLabel: "Assignments",
          tabBarHideOnKeyboard: true,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="drill"
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Icon name="golf" size={size} color={color} />;
          },
          tabBarLabel: "Drills",
          tabBarHideOnKeyboard: true,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="team"
        options={{
          tabBarIcon: ({ color, size }) => {
            return (
              <Icon name="account-group-outline" size={size} color={color} />
            );
          },
          tabBarLabel: "Team",
          tabBarHideOnKeyboard: true,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Icon name="account-circle" size={size} color={color} />;
          },
          tabBarLabel: "Profile",
          tabBarHideOnKeyboard: true,
          headerShown: false,
        }}
      />
    </Tabs>
  );
};
