import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "~/firebaseConfig";

export const useEmailInfo = (userId) => {
  const {
    data: userEmail,
    error,
    isLoading,
    isRefetching,
  } = useQuery({
    queryKey: ["userEmail", userId],
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
    userEmail,
    userEmailError: error,
    userEmailIsLoading: isLoading,
    userEmailIsRefetching: isRefetching,
  };
};
