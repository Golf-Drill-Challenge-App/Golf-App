import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { AuthProvider } from "~/context/Auth";

// Create a client
const queryClient = new QueryClient();

export default function RootLayoutNav() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="content" />
          <Stack.Screen name="test" />
        </Stack>
      </AuthProvider>
    </QueryClientProvider>
  );
}
