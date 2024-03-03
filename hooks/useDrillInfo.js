import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { useContext } from "react";
import db from "~/firebaseConfig";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export const useDrillInfo = (drillId) => {
  const teamId = useContext(CurrentUserContext).currentTeam;
  const { data, error, isLoading } = useQuery({
    queryKey: ["drillInfo", teamId, drillId],
    queryFn: async () => {
      const querySnapshot = await getDoc(
        doc(db, "teams", teamId, "drills", drillId),
      );
      return querySnapshot.data();
    },
  });

  return {
    data,
    error,
    isLoading,
  };
};
