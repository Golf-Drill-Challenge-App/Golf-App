import { useRouter, useSegments } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "~/firebaseConfig";

const AuthContext = createContext({
  signOut() {
    return;
  },
  setCurrentUserId() {
    return;
  },
  setCurrentTeamId() {
    return;
  },
  currentUserId: null,
  currentTeamId: null,
});

export function currentAuthContext() {
  return useContext(AuthContext);
}

function useProtectedRoute(currentUserId) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments.at(0) === "(auth)";

    if (!currentUserId && !inAuthGroup) {
      router.replace("/signin");
    } else if (currentUserId && inAuthGroup) {
      router.replace("/");
    }
  }, [currentUserId, segments]);
}

export const AuthProvider = ({ children }) => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentTeamId, setCurrentTeamId] = useState("1");

  useProtectedRoute(currentUserId);

  useEffect(() => {
    //if this code is not in here, it'll run for infinite times
    onAuthStateChanged(auth, (currentUserId) => {
      console.log("user changed");

      // test user login (yarn test)
      // If you sign out, reload app to sign back in as test user
      if (process.env.EXPO_PUBLIC_TEST_UID) {
        setCurrentUserId(process.env.EXPO_PUBLIC_TEST_UID);
      }

      // regular user login
      else {
        if (currentUserId) {
          setCurrentUserId(currentUserId.uid ?? "Error (uid)");
        }
      }
    });
  }, []);
  return (
    <AuthContext.Provider
      value={{
        currentUserId: currentUserId,
        setCurrentUserId: (uidvar) => {
          setCurrentUserId(uidvar ?? "Error (uid)");
          console.log(currentUserId);
        },
        // setCurrentUserId({ name: "Test", email: "test@example.com", type: type }),
        signOut: () => setCurrentUserId(null),
        currentTeamId,
        setCurrentTeamId: (tidvar) => {
          setCurrentTeamId(tidvar ?? "Error (tid)");
          console.log(currentTeamId);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
