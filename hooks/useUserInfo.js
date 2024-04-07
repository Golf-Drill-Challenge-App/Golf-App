import { useQuery } from "@tanstack/react-query";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { currentAuthContext } from "~/context/Auth";
import { db } from "~/firebaseConfig";

export const useUserInfo = (userId) => {
  const { currentTeamId } = currentAuthContext();

  const { data, error, isLoading, isRefetching } = useQuery({
    queryKey: ["user", { currentTeamId, userId }],
    queryFn: async () => {
      if (userId) {
        const querySnapshot = await getDoc(
          doc(db, "teams", currentTeamId, "users", userId),
        );
        return querySnapshot.data();
      } else {
        const newUserInfo = {};
        const querySnapshot = await getDocs(
          collection(db, "teams", currentTeamId, "users"),
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
    userIsRefetching: isRefetching,
  };
};
