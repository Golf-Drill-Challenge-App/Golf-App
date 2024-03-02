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
      router.replace("/signin");
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
