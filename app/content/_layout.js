import { Tabs } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { currentAuthContext } from "~/context/Auth";

export default () => {
  const { user } = currentAuthContext();
  console.log("user", user);
  return (
    <Tabs options={{ headerShown: false }}>
      <Tabs.Screen
        name="plan"
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Icon name="collage" size={size} color={color} />;
          },
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="drill"
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Icon name="golf" size={size} color={color} />;
          },
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
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Icon name="account-circle" size={size} color={color} />;
          },
          headerShown: false,
        }}
      />
    </Tabs>
  );
};
