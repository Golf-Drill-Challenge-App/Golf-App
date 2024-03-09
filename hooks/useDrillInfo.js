import { useQuery } from "@tanstack/react-query";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { currentAuthContext } from "~/context/Auth";
import { db } from "~/firebaseConfig";

export const useDrillInfo = (drillId = null) => {
  const { teamId } = currentAuthContext().currentTeam;
  const { data, error, isLoading } = useQuery({
    queryKey: drillId ? ["drillInfo", teamId, drillId] : ["drillInfo", teamId],
    queryFn: async () => {
      if (drillId) {
        // Fetch specific drill info
        const docSnapshot = await getDoc(
          doc(db, "teams", teamId, "drills", drillId),
        );
        return docSnapshot.data();
      } else {
        // Fetch all drills info
        const newDrillInfo = {};
        const querySnapshot = await getDocs(
          collection(db, "teams", teamId, "drills"),
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
