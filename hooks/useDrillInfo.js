import { useQuery } from "@tanstack/react-query";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useAuthContext } from "~/context/Auth";
import { db } from "~/firebaseConfig";

export const useDrillInfo = ({ drillId = null } = {}) => {
  const { currentTeamId } = useAuthContext();
  const { data, error, isLoading } = useQuery({
    queryKey: ["drillInfo", { drillId }],
    queryFn: async () => {
      console.log("fetching drillInfo: ", { drillId });
      if (drillId) {
        // Fetch specific drill info
        const docSnapshot = await getDoc(
          doc(db, "teams", currentTeamId, "drills", drillId),
        );
        return docSnapshot.data();
      } else {
        // Fetch all drills info
        const newDrillInfo = {};
        const querySnapshot = await getDocs(
          collection(db, "teams", currentTeamId, "drills"),
        );
        querySnapshot.forEach((doc) => {
          newDrillInfo[doc.id] = doc.data();
        });
        return newDrillInfo;
      }
    },
  });

  return {
    data,
    error,
    isLoading,
  };
};
