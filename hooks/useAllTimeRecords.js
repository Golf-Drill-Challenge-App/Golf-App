import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { currentAuthContext } from "~/context/Auth";
import { db } from "~/firebaseConfig";

export const useAllTimeRecords = (drillId) => {
  const { currentTeamId } = currentAuthContext();

  const { data, error, isLoading } = useQuery({
    queryKey: ["all_time_records", { currentTeamId }, { drillId }],
    queryFn: async () => {
      // Fetch all time records
      const querySnapshot = await getDoc(
        doc(db, "teams", currentTeamId, "all_time_records", drillId),
      );
      const data = querySnapshot.data();
      if (data === undefined) {
        return false;
      }
      return querySnapshot.data();
    },
  });

  return {
    data,
    allTimeRecordError: error,
    allTimeRecordIsLoading: isLoading,
  };
};
