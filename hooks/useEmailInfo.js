import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "~/firebaseConfig";

export const useEmailInfo = (userId) => {
  const {
    data: userEmail,
    error,
    isLoading,
  } = useQuery({
    queryKey: userId ? ["user", userId] : null,
    queryFn: async () => {
      console.log("userId:", userId);
      if (userId) {
        const querySnapshot = await getDoc(doc(db, "users", userId));
        console.log("querySnapshot:", querySnapshot.data().email);
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
  };
};
