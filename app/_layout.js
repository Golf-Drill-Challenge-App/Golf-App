import { Tabs } from "expo-router/tabs";
import { useSegments } from "expo-router";

export default function AppLayout() {
  const segment = useSegments();
  console.log(segment);
  return (
    <Tabs initialRouteName="(content)" screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="(content)/drill/index"
        options={{
          // Ensure the tab always links to the same href.
          href: "/drill",
          title: "Drill",
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="(content)/drill/[id]/index"
        options={{
          // Ensure the tab always links to the same href.
          href: null,
          title: "Drill",
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="(content)/drill/[id]/description"
        options={{
          // Ensure the tab always links to the same href.
          href: null,
          title: "Drill",
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="(content)/drill/[id]/leaderboard"
        options={{
          // Ensure the tab always links to the same href.
          href: null,
          title: "Drill",
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="(content)/drill/[id]/statistics"
        options={{
          // Ensure the tab always links to the same href.
          href: null,
          title: "Drill",
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="(content)/drill/[id]/submission"
        options={{
          // Ensure the tab always links to the same href.
          href: null,
          title: "Drill",
          headerShown: false,
          tabBarStyle: {
            display: "none",
          },
        }}
      />

      <Tabs.Screen
        name="(content)/drill/[id]/users"
        options={{
          // Ensure the tab always links to the same href.
          href: null,
          title: "Drill",
          headerShown: false,
          tabBarStyle: {
            display: "none",
          },
        }}
      />

      <Tabs.Screen
        name="(content)/team"
        options={{
          // Ensure the tab always links to the same href.
          href: "/team/",
          title: "Team",
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="(content)/profile"
        options={{
          // Ensure the tab always links to the same href.
          href: "/profile/",
          title: "Profile",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="(content)/plan"
        options={{
          // Ensure the tab always links to the same href.
          href: "/plan/",
          title: "Plan",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          // Ensure the tab always links to the same href.
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
