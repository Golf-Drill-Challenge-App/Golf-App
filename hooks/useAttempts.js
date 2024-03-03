import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useContext } from "react";
import db from "~/firebaseConfig";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export const useAttempts = (drillId) => {
  const teamId = useContext(CurrentUserContext).currentTeam;
  const { data, error, isLoading } = useQuery({
    queryKey: ["attempts", teamId, drillId],
    queryFn: async () => {
      const newAttempts = {};
      const querySnapshot = await getDocs(
        query(
          collection(db, "teams", teamId, "attempts"),
          where("did", "==", drillId),
        ),
      );
      querySnapshot.forEach((doc) => {
        newAttempts[doc.data().uid] = doc.data();
      });
      return newAttempts;
    },
  });

  return {
    data,
    error,
    isLoading,
  };
};
