import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { useContext } from "react";
import db from "~/firebaseConfig";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export const useUsers = () => {
  const teamId = useContext(CurrentUserContext).currentTeam;
  const { data, error, isLoading } = useQuery({
    queryKey: ["users", teamId],
    queryFn: async () => {
      const newUserInfo = {};
      const querySnapshot = await getDocs(
        collection(db, "teams", teamId, "users"),
      );
      querySnapshot.forEach((doc) => {
        newUserInfo[doc.id] = doc.data();
      });
      return newUserInfo;
    },
  });

  return {
    data,
    error,
    isLoading,
  };
};
