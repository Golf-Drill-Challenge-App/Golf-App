import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { useAuthContext } from "~/context/Auth";
import { db } from "~/firebaseConfig";

export const useBlackList = ({ enabled = true } = {}) => {
  const { currentTeamId } = useAuthContext();

  const { data, error, isLoading } = useQuery({
    queryKey: ["blacklist"],
    queryFn: async () => {
      console.log("fetching blacklist");
      const newBlacklist = {};
      // Fetch all time records
      const querySnapshot = await getDocs(
        collection(db, "teams", currentTeamId, "blacklist"),
      );
      querySnapshot.forEach((doc) => {
        newBlacklist[doc.id] = doc.data();
      });
      return newBlacklist;
    },
    enabled,
  });

  return {
    data,
    error,
    isLoading,
  };
};
