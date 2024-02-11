import { Tabs } from "expo-router/tabs";
import { useSegments } from "expo-router";

export default function AppLayout() {
  const segment = useSegments();
  console.log(segment); // although no longer using useSegments to define which tabbars are shown,
  // it is still useful for debugging because the "name" field in the Tabs.screen matches the segments pretty closely.
  // Since _layout works like depth-first search, the outermost directories with a _layout determines how far nested
  // the segments are.
  return (
    <Tabs initialRouteName="(content)" screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="(content)/drill/index"
        // show tab and tabbar
        options={{
          href: "/drill",
          title: "Drill",
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="(content)/drill/[id]/index"
        // hide tab, show tabbar
        options={{
          href: null,
          title: "Drill ID index",
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="(content)/drill/[id]/description"
        // hide tab, show tabbar
        options={{
          href: null,
          title: "Drill ID description",
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="(content)/drill/[id]/leaderboard"
        // hide tab, show tabbar
        options={{
          href: null,
          title: "Drill ID leaderboard",
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="(content)/drill/[id]/statistics"
        // hide tab, show tabbar
        options={{
          href: null,
          title: "Drill ID statistics",
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="(content)/drill/[id]/submission" // applies to all files in drill submission directory
        // hide tab and tabbar
        options={{
          href: null,
          title: "Drill submission directory",
          headerShown: false,
          tabBarStyle: {
            display: "none",
          },
        }}
      />

      <Tabs.Screen
        name="(content)/drill/[id]/users" // this page comes up when you click on a specific user on a leaderboard
        // hide tab and tabbar
        options={{
          href: null,
          title: "Drill leaderboard user info",
          headerShown: false,
          tabBarStyle: {
            display: "none",
          },
        }}
      />

      <Tabs.Screen
        name="(content)/team"
        // show tab and tabbar
        options={{
          href: "/team/", // only 1 tabscreen is needed due to _layout.js placement (like depth-first search)
          title: "Team",
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="(content)/profile"
        // show tab and tabbar
        options={{
          href: "/profile/", // only 1 tabscreen is needed due to _layout.js placement (like depth-first search)
          title: "Profile",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="(content)/plan"
        // show tab and tabbar
        options={{
          href: "/plan/", // only 1 tabscreen is needed due to _layout.js placement (like depth-first search)
          title: "Plan",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        // hide tab, show tabbar
        name="index"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
