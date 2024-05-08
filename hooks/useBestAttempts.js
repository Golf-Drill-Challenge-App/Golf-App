import { useQuery } from "@tanstack/react-query";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { currentAuthContext } from "~/context/Auth";
import { db } from "~/firebaseConfig";

export const useBestAttempts = ({ drillId = null, userId = null } = {}) => {
  console.log("fetching bestAttempts: ", { drillId });
  const { currentTeamId } = currentAuthContext();
  const { data, error, isLoading } = useQuery({
    queryKey: ["best_attempts", { drillId, userId }],
    queryFn: async () => {
      if (drillId) {
        // Fetch all drills info
        const querySnapshot = await getDoc(
          doc(db, "teams", currentTeamId, "best_attempts", drillId),
        );
        const data = querySnapshot.data();
        if (data === undefined) {
          return false;
        }
        return querySnapshot.data();
      } else if (userId) {
        // Fetch all drills this user has done
        const newLeaderboard = {};
        const q = query(
          collection(db, "teams", currentTeamId, "best_attempts"),
          where(userId, "!=", null),
        );

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          newLeaderboard[doc.id] = doc.data();
        });
        return newLeaderboard;
      } else {
        //Fetch everything
        const newLeaderboard = {};
        const querySnapshot = await getDocs(
          collection(db, "teams", currentTeamId, "best_attempts"),
        );

        querySnapshot.forEach((doc) => {
          newLeaderboard[doc.id] = doc.data();
        });
      }
    },
  });

  return {
    data,
    error,
    isLoading,
  };
};
