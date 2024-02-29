import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useState } from "react";
import { CurrentUserContext } from "~/contexts/CurrentUserContext";

// Create a client
const queryClient = new QueryClient();

export default function RootLayoutNav() {
  const [currentUser, setCurrentUser] = useState("c0nEyjaOMhItMQTLMY0X");
  const [currentTeam, setCurrentTeam] = useState("1");

export default function RootLayoutNav() {
  return (
    <QueryClientProvider client={queryClient}>
      <CurrentUserContext.Provider
        value={{ currentUser, currentTeam, setCurrentUser, setCurrentTeam }}
      >
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
    </QueryClientProvider>
  );
}
