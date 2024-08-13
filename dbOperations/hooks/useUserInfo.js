import { useQuery } from "@tanstack/react-query";
import { router, useSegments } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useAuthContext } from "~/context/Auth";
import { db } from "~/firebaseConfig";

export const useUserInfo = ({
  userId = null,
  role = null,
  enabled = true,
} = {}) => {
  const segments = useSegments();
  const { currentTeamId, currentUserId, currentUserVerified } =
    useAuthContext();
  const week_milliseconds = 604800000;
  const currentDate = new Date();
  const currentDateTime = currentDate.getTime();

  const { data, error, isLoading } = useQuery({
    queryKey: ["userInfo", { userId, role }],
    queryFn: async () => {
      console.log("fetching userInfo: ", { userId, role });
      if (userId) {
        const querySnapshot = await getDoc(
          doc(db, "teams", currentTeamId, "users", userId),
        );
        const data = querySnapshot.data();
        const inChooseTeam = segments.at(-1) === "chooseTeam";
        if (!data || !currentUserVerified) {
          if (currentUserId === userId && !inChooseTeam) {
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
        if (inChooseTeam) {
          router.replace("content/assignments");
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
      } else if (role) {
        const q = query(
          collection(db, "teams", currentTeamId, "users"),
          where("role", "==", role),
        );
        const querySnapshot = await getDocs(q);
        const newUserInfo = {};
        querySnapshot.forEach((doc) => {
          newUserInfo[doc.id] = doc.data();
        });
        return newUserInfo;
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
    enabled,
  });

  return {
    data,
    error,
    isLoading,
  };
};
