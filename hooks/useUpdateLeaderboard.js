import { useMutation } from "@tanstack/react-query";
import { doc, updateDoc, writeBatch } from "firebase/firestore";
import { currentAuthContext } from "../context/Auth";
import db from "../firebaseConfig";

export const useUpdateLeaderboard = ({
  //cursed function to update leaderboard
  drillId = null,
  userId = null,
  value = null,
}) => {
  const { currentTeamId } = currentAuthContext();
  // const { users, userIsLoading, userError } = useUserInfo();

  const { data, isLoading, isError } = useMutation({
    mutationFn: () => {
      if (userId) {
        //update a user's best after an attempt
        const leaderboardRef = doc(
          db,
          "teams",
          currentTeamId,
          "best_attempts",
          drillId,
          userId,
        );
        return updateDoc(leaderboardRef, value);
      } else {
        //update the entire drill table. This is for initialization of a new drill or when a drill gets a new field
        const batches = [];

        // Get a new write batch
        let batch = writeBatch(db);

        const users = Object.keys(value);

        let batchCounter = 0;

        users.forEach((user) => {
          const currentValue = value[user];
          const leaderboardUserRef = doc(
            db,
            "teams",
            currentTeamId,
            "best_attempts",
            drillId,
            user,
          );
          batch.set(leaderboardUserRef, currentValue);
          if (++batchCounter === 500) {
            batchCounter = 0;
            batches.push(batch.commit());
            batch = writeBatch(db);
          }
        });

        if (batchCounter > 0) batches.push(batch.commit());

        return Promise.all(batches);
      }
    },
  });
};
