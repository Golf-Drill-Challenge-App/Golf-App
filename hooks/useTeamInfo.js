import { useQuery } from "@tanstack/react-query";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "~/firebaseConfig";

export const useTeamInfo = ({ teamId = null } = {}) => {
  console.log("fetching teamInfo: ", { teamId });

  const { data, error, isLoading } = useQuery({
    queryKey: ["teamInfo", { teamId }],
    queryFn: async () => {
      if (teamId) {
        const querySnapshot = await getDoc(doc(db, "teams", teamId));
        return querySnapshot.data();
      } else {
        const newTeamInfo = {};
        const querySnapshot = await getDocs(collection(db, "teams"));
        querySnapshot.forEach((doc) => {
          newTeamInfo[doc.id] = doc.data();
        });
        return newTeamInfo;
      }
    },
  });

  return {
    data,
    error,
    isLoading,
  };
};
