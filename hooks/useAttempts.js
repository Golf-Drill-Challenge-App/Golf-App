import { useQuery } from "@tanstack/react-query";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useContext } from "react";
import { CurrentUserContext } from "~/contexts/CurrentUserContext";
import {db} from "~/firebaseConfig";

//this code scares me
export const useAttempts = ({
  attemptId = null,
  userId = null,
  drillId = null,
}) => {
  const teamId = useContext(CurrentUserContext).currentTeam;
  const { data, error, isLoading } = useQuery({
    queryKey: ["attempts", teamId, { attemptId, userId, drillId }],
    queryFn: async () => {
      if (attemptId) {
        const querySnapshot = await getDoc(
          doc(db, "teams", teamId, "attempts", attemptId),
        );
        return querySnapshot.data();
      } else {
        let q = query(collection(db, "teams", teamId, "attempts"));
        if (drillId) {
          q = query(q, where("did", "==", drillId));
        }
        if (userId) {
          q = query(q, where("uid", "==", userId));
        }
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => doc.data());
      }
    },
  });

  return {
    data,
    error,
    isLoading,
  };
};
