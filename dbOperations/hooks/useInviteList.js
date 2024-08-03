import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuthContext } from "~/context/Auth";
import { db } from "~/firebaseConfig";

export const useInvitelist = ({ enabled = true, email = null } = {}) => {
  const { currentTeamId } = useAuthContext();
  const { data, error, isLoading } = useQuery({
    queryKey: ["invitelist"],
    queryFn: async () => {
      console.log("fetching invitelist", { enabled, email });
      if (email) {
        const inviteQuery = query(
          collection(db, "teams", currentTeamId, "invitelist"),
          where("email", "==", email),
        );

        const invite = {};

        const attemptSnapshot = await getDocs(inviteQuery);

        attemptSnapshot.forEach((doc) => {
          invite["id"] = doc.id;
          invite["email"] = doc.data()["email"];
        });

        return invite;
      } else {
        const newWaitlist = {};
        // Fetch all time records
        const querySnapshot = await getDocs(
          collection(db, "teams", currentTeamId, "invitelist"),
        );
        querySnapshot.forEach((doc) => {
          newWaitlist[doc.id] = doc.data();
        });
        return newWaitlist;
      }
    },
    enabled,
  });

  return {
    data,
    error,
    isLoading,
  };
};
