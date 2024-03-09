import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { AuthProvider } from "~/context/Auth";

// Create a client
const queryClient = new QueryClient();

export default function RootLayoutNav() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="content" />
          <Stack.Screen name="test" />
        </Stack>
      </QueryClientProvider>
    </AuthProvider>
  );
}
