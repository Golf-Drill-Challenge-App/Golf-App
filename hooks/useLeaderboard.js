import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { currentAuthContext } from "~/context/Auth";
import { db } from "~/firebaseConfig";

export const useLeaderboard = ({ drillId = null }) => {
  const { currentTeamId } = currentAuthContext();
  const { data, error, isLoading } = useQuery({
    queryKey: ["best_attempts", currentTeamId, drillId],
    queryFn: async () => {
      // Fetch all drills info
      const newLeaderboard = {};
      const querySnapshot = await getDoc(
        doc(db, "teams", currentTeamId, "best_attempts", drillId),
      );
      const data = querySnapshot.data();
      if (data === undefined) {
        return false;
      }
      return querySnapshot.data();
    },
  });

  return {
    data,
    error,
    isLoading,
  };
};
