import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Stack } from "expo-router";
import { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DialogComponent from "~/components/dialog";
import PaperWrapper from "~/components/paperWrapper";
import { AlertContext } from "~/context/Alert";
import { AuthProvider } from "~/context/Auth";

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
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        maxAge: 1000 * 60 * 60 * 1,
      }} // 1 hour
    >
      <AuthProvider>
        <PaperWrapper>
          <GestureHandlerRootView>
            <AlertContext.Provider
              value={{
                showDialog: (title, message) => {
                  setDialogTitle(title);
                  setDialogMessage(message);
                  setDialogVisible(true);
                },
                showSnackBar: (message) => {
                  setSnackbarMessage(message);
                  setSnackbarVisible(true);
                },
              }}
            >
              {/* Generic Error dialog */}
              <DialogComponent
                title={dialogTitle}
                content={dialogMessage}
                visible={dialogVisible}
                onHide={() => setDialogVisible(false)}
              />

              {/* Snackbar Error Dialog */}
              <DialogComponent
                type={"snackbar"}
                visible={snackbarVisible}
                content={snackbarMessage}
                onHide={() => setSnackbarVisible(false)}
              />
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="index" />
                <Stack.Screen name="content" />
              </Stack>
            </AlertContext.Provider>
          </GestureHandlerRootView>
        </PaperWrapper>
      </AuthProvider>
    </PersistQueryClientProvider>
  );
}
