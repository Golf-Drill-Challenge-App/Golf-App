import { useQueryClient } from "@tanstack/react-query";
import { ScrollView, View } from "react-native";
import { Button, List } from "react-native-paper";
import { getErrorString } from "~/Utility";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import RefreshInvalidate from "~/components/refreshInvalidate";
import { useAuthContext } from "~/context/Auth";
import { addToTeam } from "~/dbOperations/addToTeam";
import { useInvitelist } from "~/dbOperations/hooks/useInviteList";
import { invalidateMultipleKeys } from "~/dbOperations/invalidateMultipleKeys";
import { removeWaitlist } from "~/dbOperations/removeWaitlist";

function Invitelist() {
  const {
    data: invitelist,
    error: inviteError,
    isLoading: inviteIsLoading,
  } = useInvitelist();

  const { currentTeamId } = useAuthContext();
  const queryClient = useQueryClient();

  if (inviteError) {
    return <ErrorComponent error={getErrorString(inviteError)} />;
  }

  if (inviteIsLoading) {
    return <Loading />;
  }

  const invalidateKeys = [["invitelist"], ["userInfo"]];

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
        {Object.keys(invitelist).map((userId) => {
          console.log("invitelist", invitelist[userId]);
          return (
            <List.Item
              title={invitelist[userId].email}
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
                      await addToTeam(
                        currentTeamId,
                        userId,
                        invitelist[userId],
                      );
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

export default Invitelist;
