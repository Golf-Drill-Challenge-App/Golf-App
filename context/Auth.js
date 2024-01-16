import { useRouter, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

const AuthContext = createContext({
  signIn() {
    return;
  },
  signOut() {
    return;
  },
  user: null,
});

export function useAuth() {
  return useContext(AuthContext);
}

function useProtectedRoute(user) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments.at(0) === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/SignIn");
    } else if (user && inAuthGroup) {
      router.replace("/");
    }
  }, [user, segments]);
}

export const Provider = ({ children }) => {
  const [user, setUser] = useState(null);

  useProtectedRoute(user);

  useEffect(() => {
    //if this code is not in here, it'll run for infinite times
    onAuthStateChanged(auth, (user) => {
      console.log("user changed");

      if (user) {
        setUser({
          name: user.displayName ?? "Error",
          email: user.email ?? "Error@email.com",
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
        // setUser({ name: "Test", email: "test@example.com", type: type }),
        signOut: () => setUser(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
