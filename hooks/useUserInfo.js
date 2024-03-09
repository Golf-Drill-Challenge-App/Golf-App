import { useQuery } from "@tanstack/react-query";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { currentAuthContext } from "~/context/Auth";
import { db } from "~/firebaseConfig";

export const useUserInfo = (userId) => {
  const { teamId } = currentAuthContext().currentTeam;

  const { data, error, isLoading } = useQuery({
    queryKey: userId ? ["user", teamId, userId] : ["users", teamId],
    queryFn: async () => {
      if (userId) {
        const querySnapshot = await getDoc(
          doc(db, "teams", teamId, "users", userId),
        );
        return querySnapshot.data();
      } else {
        const newUserInfo = {};
        const querySnapshot = await getDocs(
          collection(db, "teams", teamId, "users"),
        );
        querySnapshot.forEach((doc) => {
          newUserInfo[doc.id] = doc.data();
        });
        return newUserInfo;
      }
    },
  });

  return {
    data,
    userError: error,
    userIsLoading: isLoading,
  };
};
