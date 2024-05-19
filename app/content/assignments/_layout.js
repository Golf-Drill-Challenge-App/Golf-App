import { Stack } from "expo-router";
import { PlayerProvider } from "~/app/content/assignments/context";

export default function RootLayoutNav() {
  return (
    <>
      <PlayerProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
        </Stack>
      </PlayerProvider>
    </>
  );
}
