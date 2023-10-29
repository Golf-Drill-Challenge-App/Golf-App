import { useRouter, useSegments } from "expo-router";
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

type User = {
  type: "coach" | "player";
  name: string;
  email: string;
};

const AuthContext = createContext<{
  signIn: (type: User["type"]) => void;
  signOut: () => void;
  user: User | null;
}>({
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

function useProtectedRoute(user: object | null) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments.at(0) === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/SignIn");
    } else if (user && inAuthGroup) {
      router.replace("/Home");
    }
  }, [user, segments]);
}

export const Provider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useProtectedRoute(user);

  onAuthStateChanged(auth, (user) => {
    console.log("user changed");

    if (user) {
      setUser({
        name: user.displayName ?? "Error",
        email: user.email ?? "Error@email.com",
        type: "coach",
      });
    }
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn: (type) => {return;},
          // setUser({ name: "Test", email: "test@example.com", type: type }),
        signOut: () => setUser(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
