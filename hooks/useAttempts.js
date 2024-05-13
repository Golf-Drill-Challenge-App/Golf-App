import { useQuery } from "@tanstack/react-query";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { currentAuthContext } from "~/context/Auth";
import { db } from "~/firebaseConfig";

//this code scares me
export const useAttempts = ({
  attemptId = null,
  userId = null,
  drillId = null,
  enabled = true,
} = {}) => {
  console.log("fetching attempts: ", { attemptId, userId, drillId, enabled });
  const { currentTeamId } = currentAuthContext();
  const { data, error, isLoading } = useQuery({
    queryKey: ["attempts", { attemptId, userId, drillId }],
    queryFn: async () => {
      console.log("fetching attempts: ", {
        attemptId,
        userId,
        drillId,
        enabled,
      });
      if (attemptId) {
        const querySnapshot = await getDoc(
          doc(db, "teams", currentTeamId, "attempts", attemptId),
        );
        return querySnapshot.data();
      } else {
        let q = query(collection(db, "teams", currentTeamId, "attempts"));
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
    enabled,
  });

  return {
    data,
    error,
    isLoading,
  };
};
