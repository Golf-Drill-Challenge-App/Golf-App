import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="Home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: () => <FontAwesome name="home" />,
        }}
      />
      <Tabs.Screen
        name="TestPage"
        options={{
          tabBarLabel: "Test Page",
          tabBarIcon: () => <FontAwesome name="pagelines" />,
        }}
      />
    </Tabs>
  );
}
