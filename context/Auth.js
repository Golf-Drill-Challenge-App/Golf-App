import { useRouter, useSegments } from "expo-router";
import { onIdTokenChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "~/firebaseConfig";

const AuthContext = createContext({
  signOut() {},
  setCurrentUserId() {},
  setCurrentTeamId() {},
  setCurrentUserInfo() {},
  currentUserId: null,
  currentTeamId: null,
  currentUserInfo: null,
  currentUserVerified: false,
});

export function useAuthContext() {
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
      router.replace("/content/assignments");
    }
  }, [currentUserId, router, segments]);
}

export const AuthProvider = ({ children }) => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const [currentTeamId, setCurrentTeamId] = useState("1");
  const [currentUserVerified, setCurrentUserVerified] = useState(false);

  useProtectedRoute(currentUserId);

  useEffect(() => {
    //if this code is not in here, it'll run for infinite times
    onIdTokenChanged(auth, (newlyLoggedInUser) => {
      // test user login (yarn test)
      // If you sign out, reload or click "sign in" to login as test user
      // Signout functionality for test user is buggy, chance of auto-logging back in
      if (process.env.EXPO_PUBLIC_TEST_UID) {
        setCurrentUserId(process.env.EXPO_PUBLIC_TEST_UID);
        console.log("user changed. userId:", process.env.EXPO_PUBLIC_TEST_UID);
      }

      // regular user login
      else {
        if (newlyLoggedInUser) {
          setCurrentUserId(newlyLoggedInUser["uid"] ?? "Error (uid)");
          setCurrentUserInfo(newlyLoggedInUser ?? {});
          console.log("user changed. userId:", newlyLoggedInUser["uid"]);
          if (auth.currentUser.emailVerified) {
            setCurrentUserVerified(true);
          }
        }
      }
    });
  }, [currentUserVerified]);
  return (
    <AuthContext.Provider
      value={{
        currentUserId,
        setCurrentUserId: (uidvar) => {
          setCurrentUserId(uidvar ?? "Error (uid)");
        },
        signOut: () => {
          setCurrentUserId(null);
          setCurrentUserInfo({});
        },
        currentTeamId,
        setCurrentTeamId: (tidvar) => {
          setCurrentTeamId(tidvar ?? "Error (tid)");
        },
        setCurrentUserInfo(userInfo) {
          setCurrentUserInfo(userInfo);
        },
        currentUserInfo,
        currentUserVerified,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
