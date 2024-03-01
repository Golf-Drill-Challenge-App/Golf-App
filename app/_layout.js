import { Stack } from "expo-router";
import { useState } from "react";
import { CurrentUserContext } from "~/Contexts";

export default function RootLayoutNav() {
  const [currentUser, setCurrentUser] = useState("c0nEyjaOMhItMQTLMY0X");

  // Function to update the context value
  const updateCurrentUser = (newValue) => {
    setCurrentUser(newValue);
  };
  return (
    <CurrentUserContext.Provider value={{ currentUser, updateCurrentUser }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="content" />
        <Stack.Screen name="test" />
      </Stack>
    </CurrentUserContext.Provider>
  );
}
