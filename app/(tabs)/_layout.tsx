import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { Pressable, useColorScheme } from "react-native";

import Colors from "../../constants/Colors";
import { useAuth } from "../../context/Auth";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

const screens = [
  { name: "Home", title: "Home", iconName: "home" as const },
  { name: "Profile", title: "Profile", iconName: "user-circle" as const },
  { name: "Notifications", title: "Notifications", iconName: "bell" as const },
  { name: "Settings", title: "Settings", iconName: "gear" as const },
  {
    name: "Drills/[id]",
    title: "Drills",
    iconName: "code" as const,
    options: { href: null },
  },
];

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { signOut } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      {screens.map(({ name, title, iconName, options }, i) => (
        <Tabs.Screen
          key={i}
          name={name}
          options={{
            title: title,
            tabBarIcon: ({ color }) => (
              <TabBarIcon name={iconName} color={color} />
            ),
            headerRight: () => (
              <Pressable onPress={() => signOut()}>
                {({ pressed }) => (
                  <FontAwesome
                    name="sign-out"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            ),
            ...options,
          }}
        />
      ))}
    </Tabs>
  );
}
