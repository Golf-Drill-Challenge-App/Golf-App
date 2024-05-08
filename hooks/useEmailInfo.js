import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "~/firebaseConfig";

export const useEmailInfo = ({ userId = null }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["userEmail", { userId }],
    queryFn: async () => {
      if (userId) {
        const querySnapshot = await getDoc(doc(db, "users", userId));
        return querySnapshot.data().email;
      } else {
        throw new Error("User ID not found!");
      }
    },
  });

  return {
    data,
    error,
    isLoading,
  };
};
