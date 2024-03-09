import { useRouter, useSegments } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "~/firebaseConfig";

const AuthContext = createContext({
  signOut() {
    return;
  },
  setCurrentUser() {
    return;
  },
  setCurrentTeam() {
    return;
  },
  currentUser: null,
  currentTeam: null,
});

export function currentAuthContext() {
  return useContext(AuthContext);
}

function useProtectedRoute(currentUser) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments.at(0) === "(auth)";

    if (!currentUser && !inAuthGroup) {
      router.replace("/signin");
    } else if (currentUser && inAuthGroup) {
      router.replace("/");
    }
  }, [currentUser, segments]);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentTeam, setCurrentTeam] = useState("1");

  useProtectedRoute(currentUser);

  useEffect(() => {
    //if this code is not in here, it'll run for infinite times
    onAuthStateChanged(auth, (currentUser) => {
      console.log("user changed");
      if (currentUser) {
        setCurrentUser(currentUser.uid ?? "Error (uid)");
      }
    });

    // yarn test
    // If you sign out, reload app to sign back in as test user
    // Moved outside of useEffect to avoid race condition with logout
    if (process.env.EXPO_PUBLIC_TEST_UID) {
      setCurrentUser(process.env.EXPO_PUBLIC_TEST_UID);
    }
  }, []);
  return (
    <AuthContext.Provider
      value={{
        currentUser: currentUser,
        setCurrentUser: (uidvar) => {
          setCurrentUser(uidvar ?? "Error (uid)");
          console.log(currentUser);
        },
        // setCurrentUser({ name: "Test", email: "test@example.com", type: type }),
        signOut: () => setCurrentUser(null),
        currentTeam,
        setCurrentTeam: (tidvar) => {
          setCurrentTeam(tidvar ?? "Error (tid)");
          console.log(currentTeam);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
