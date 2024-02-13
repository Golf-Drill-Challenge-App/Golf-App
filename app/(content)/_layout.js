import { Tabs } from "expo-router/tabs";
import { useSegments } from "expo-router";

export default function AppLayout() {
  // comment out below for debug
  // const segment = useSegments();
  // console.log(segment); // although no longer using useSegments to define which tabbars are shown,
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="drill/index"
        // show tab and tabbar
        options={{
          href: "/drill",
          title: "Drills",
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="drill/[id]/(segments)"
        // hide tab, show tabbar
        options={{
          href: null,
          title: "Drill ID index",
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="drill/[id]/submission" // applies to all files in drill submission directory
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
        name="drill/[id]/users" // this page comes up when you click on a specific user on a leaderboard
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
        name="team"
        // show tab and tabbar
        options={{
          href: "/team/", // only 1 tabscreen is needed due to _layout.js placement (like depth-first search)
          title: "Team",
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="profile"
        // show tab and tabbar
        options={{
          href: "/profile/", // only 1 tabscreen is needed due to _layout.js placement (like depth-first search)
          title: "Profile",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="plan"
        // show tab and tabbar
        options={{
          href: "/plan/", // only 1 tabscreen is needed due to _layout.js placement (like depth-first search)
          title: "Plan",
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
