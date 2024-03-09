import { useRouter, useSegments } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "~/firebaseConfig";

const AuthContext = createContext({
  signIn() {
    return;
  },
  signOut() {
    return;
  },
  setUser() {
    return;
  },
  user: null,
  teamId: null,
});

export function currentAuthContext() {
  return useContext(AuthContext);
}

function useProtectedRoute(user) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments.at(0) === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/signin");
    } else if (user && inAuthGroup) {
      router.replace("/");
    }
  }, [user, segments]);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [teamId, setTeamId] = useState("1"); // TODO: Set this properly instead of hardcoding team

  useProtectedRoute(user);

  useEffect(() => {
    //if this code is not in here, it'll run for infinite times
    onAuthStateChanged(auth, (user) => {
      console.log("user changed");

      // yarn test
      // If you sign out, reload app to sign back in as test user
      // TODO: After setting users properly, set test user too
      if (process.env.EXPO_PUBLIC_TEST_UID) {
        setUser({
          name: process.env.EXPO_PUBLIC_TEST_NAME,
          email: process.env.EXPO_PUBLIC_TEST_EMAIL,
          uid: process.env.EXPO_PUBLIC_TEST_UID,
        });
      }
      if (user) {
        setUser({
          name: user.displayName ?? "Error (name)",
          email: user.email ?? "Error (email)",
          uid: user.uid ?? "Error (uid)",
        });
      }
    });
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        signIn: () => {
          return;
        },
        setUser: (namevar, emailvar, uidvar) => {
          setUser({
            name: namevar ?? "Error (name)",
            email: emailvar ?? "Error (email)",
            uid: uidvar ?? "Error (uid)",
          });
          console.log(user);
        },
        // setUser({ name: "Test", email: "test@example.com", type: type }),
        signOut: () => setUser(null),
        teamId, // todo: add teamId setter
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
