import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Stack } from "expo-router";
import DropDownPicker from "react-native-dropdown-picker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PaperWrapper from "~/components/paperWrapper";
import { AlertProvider } from "~/context/Alert";
import { AuthProvider } from "~/context/Auth";
import { TimeProvider } from "~/context/Time";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 1, // 1 hour
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

DropDownPicker.setListMode("SCROLLVIEW");

export default function RootLayoutNav() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        maxAge: 1000 * 60 * 60 * 1,
      }} // 1 hour
    >
      <AuthProvider>
        <TimeProvider>
          <PaperWrapper>
            <GestureHandlerRootView>
              <AlertProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                  }}
                >
                  <Stack.Screen name="index" />
                  <Stack.Screen name="content" />
                </Stack>
              </AlertProvider>
            </GestureHandlerRootView>
          </PaperWrapper>
        </TimeProvider>
      </AuthProvider>
    </PersistQueryClientProvider>
  );
}
