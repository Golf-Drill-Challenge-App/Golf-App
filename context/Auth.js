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
      // test user login (yarn test)
      // If you sign out, reload or click "sign in" to login as test user
      // Signout functionality for test user is buggy, chance of auto-logging back in
      if (process.env.EXPO_PUBLIC_TEST_UID) {
        setCurrentUserId(process.env.EXPO_PUBLIC_TEST_UID);
        console.log("user changed. userId:", process.env.EXPO_PUBLIC_TEST_UID);
      }

      // regular user login
      else {
        if (currentUserId) {
          setCurrentUserId(currentUserId["uid"] ?? "Error (uid)");
          console.log("user changed. userId:", currentUserId["uid"]);
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
        },
        signOut: () => setCurrentUserId(null),
        currentTeamId,
        setCurrentTeamId: (tidvar) => {
          setCurrentTeamId(tidvar ?? "Error (tid)");
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
