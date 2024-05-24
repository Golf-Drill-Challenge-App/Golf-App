import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { currentAuthContext } from "~/context/Auth";
import { db } from "~/firebaseConfig";

export const useUserInfo = ({ userId = null } = {}) => {
  const { currentTeamId, currentUserId } = currentAuthContext();
  const week_milliseconds = 604800000;
  const currentDate = new Date();
  const currentDateTime = currentDate.getTime();

  const { data, error, isLoading } = useQuery({
    queryKey: ["userInfo", { userId }],
    queryFn: async () => {
      console.log("fetching userInfo: ", { userId });
      if (userId) {
        const querySnapshot = await getDoc(
          doc(db, "teams", currentTeamId, "users", userId),
        );
        const data = querySnapshot.data();
        if (!data) {
          if (currentUserId === userId) {
            router.replace("segments/(team)/chooseTeam");
          }
          return {
            name: "",
            pfp: "",
            role: "",
            uid: "",
            assigned_data: [],
            uniqueDrills: [],
          };
        }
        const filteredAssignedData = data.assigned_data.filter((assignment) => {
          const timeDifference = currentDateTime - assignment.assignedTime;
          return timeDifference <= week_milliseconds;
        });

        if (filteredAssignedData.length !== data.assigned_data.length) {
          const updatedData = {
            ...data,
            assigned_data: filteredAssignedData,
          };
          await updateDoc(
            doc(db, "teams", currentTeamId, "users", userId),
            updatedData,
          );
          return updatedData;
        }
        return data;
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
    error,
    isLoading,
  };
};
