import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { useAuthContext } from "~/context/Auth";
import { db } from "~/firebaseConfig";

export const useWaitlist = ({ enabled = true } = {}) => {
  const { currentTeamId } = useAuthContext();
  const { data, error, isLoading } = useQuery({
    queryKey: ["waitlist"],
    queryFn: async () => {
      console.log("fetching waitlist");
      const newWaitlist = {};
      // Fetch all Entries on the Waitlist
      const querySnapshot = await getDocs(
        collection(db, "teams", currentTeamId, "waitlist"),
      );
      querySnapshot.forEach((doc) => {
        newWaitlist[doc.id] = doc.data();
      });
      return newWaitlist;
    },
    enabled,
  });

  return {
    data,
    error,
    isLoading,
  };
};
