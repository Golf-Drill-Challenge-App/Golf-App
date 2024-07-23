import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { useAuthContext } from "~/context/Auth";
import { db } from "~/firebaseConfig";

export const useInvitelist = ({ enabled = true } = {}) => {
  const { currentTeamId } = useAuthContext();
  const { data, error, isLoading } = useQuery({
    queryKey: ["invitelist"],
    queryFn: async () => {
      console.log("fetching invitelist");
      const newWaitlist = {};
      // Fetch all time records
      const querySnapshot = await getDocs(
        collection(db, "teams", currentTeamId, "invitelist"),
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
