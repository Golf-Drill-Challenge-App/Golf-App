import { useQueryClient } from "@tanstack/react-query";
import { ScrollView, View } from "react-native";
import { Button, List } from "react-native-paper";
import { getErrorString } from "~/Utility";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import RefreshInvalidate from "~/components/refreshInvalidate";
import { useAuthContext } from "~/context/Auth";
import { addToTeam } from "~/dbOperations/addToTeam";
import { useWaitlist } from "~/dbOperations/hooks/useWaitlist";
import { invalidateMultipleKeys } from "~/dbOperations/invalidateMultipleKeys";
import { removeWaitlist } from "~/dbOperations/removeWaitlist";

function Waitlist() {
  const {
    data: waitlist,
    error: waitlistError,
    isLoading: waitlistIsLoading,
  } = useWaitlist();

  const { currentTeamId } = useAuthContext();
  const queryClient = useQueryClient();

  if (waitlistError) {
    return <ErrorComponent error={getErrorString(waitlistError)} />;
  }

  if (waitlistIsLoading) {
    return <Loading />;
  }

  const invalidateKeys = [["waitlist", "userInfo"]];

  return (
    <ScrollView
      refreshControl={<RefreshInvalidate invalidateKeys={invalidateKeys} />}
    >
      <List.Section
        style={{
          margin: 5,
          borderRadius: 5,
        }}
      >
        {Object.keys(waitlist).map((userId) => {
          console.log("waitlist", waitlist[userId]);
          return (
            <List.Item
              title={waitlist[userId].email}
              key={userId}
              right={() => (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingLeft: 10,
                  }}
                >
                  <Button
                    onPress={async () => {
                      await addToTeam(currentTeamId, userId, waitlist[userId]);
                      await removeWaitlist(currentTeamId, userId);
                      await invalidateMultipleKeys(queryClient, invalidateKeys);
                    }}
                    textColor={"green"}
                  >
                    Accept
                  </Button>
                  <Button
                    onPress={async () => {
                      await removeWaitlist(currentTeamId, userId);
                      await invalidateMultipleKeys(queryClient, invalidateKeys);
                    }}
                    textColor={"red"}
                  >
                    Reject
                  </Button>
                </View>
              )}
            />
          );
        })}
      </List.Section>
    </ScrollView>
  );
}

export default Waitlist;
