import { Tabs } from "expo-router/tabs";

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={({ route, navigation }) => {
        // reference: https://stackoverflow.com/a/77251731
        const state = navigation.getState();
        const isDrillSubmission =
          state.routes[state.index].state?.index == 2 &&
          state.routes[state.index].params?.screen.includes("[id]/submission"); //  if the current state's route has a state, and its not the index of that route, then we've detected nested navigation
        //console.log(state.routes[state.index].state?.index)
        //console.log(state.routes[state.index].params?.screen)

        return {
          tabBarStyle: {
            display: isDrillSubmission ? "none" : undefined, // hide for all nested navigation screens
          },
        };
      }}
    >
      <Tabs.Screen
        name="drill"
        // show tab and tabbar
        options={{
          href: "/drill",
          title: "Drills",
          headerShown: false,
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
