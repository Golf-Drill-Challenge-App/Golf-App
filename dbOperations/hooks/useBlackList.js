import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { useAuthContext } from "~/context/Auth";
import { db } from "~/firebaseConfig";

export const useBlackList = ({ enabled = true } = {}) => {
  const { currentTeamId } = useAuthContext();

  const { data, error, isLoading } = useQuery({
    queryKey: ["blackList"],
    queryFn: async () => {
      console.log("fetching blacklist");
      // Fetch all time records
      const querySnapshot = await getDoc(
        doc(db, "teams", currentTeamId, "blacklist"),
      );
      const data = querySnapshot.data();
      if (data === undefined) {
        return false;
      }
      return querySnapshot.data();
    },
    enabled,
  });

  return {
    data,
    error,
    isLoading,
  };
};
