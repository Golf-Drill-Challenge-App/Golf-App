import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Button, List } from "react-native-paper";
import { themeColors } from "~/Constants";
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

  //this is a pretty blunt implementation... I'm using the same variable here because each entry will disappear after either buttons are pressed
  const [loading, setLoading] = useState({});

  if (waitlistError) {
    return <ErrorComponent error={getErrorString(waitlistError)} />;
  }

  if (waitlistIsLoading) {
    return <Loading />;
  }

  const invalidateKeys = [["waitlist"], ["userInfo"]];

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
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  height={38} //so the button doesn't change size because of the spinner
                  width={100}
                >
                  {loading[userId] ? (
                    <ActivityIndicator color={themeColors.accent} />
                  ) : (
                    <View
                      style={{
                        flexDirection: "row",
                        paddingLeft: 10,
                      }}
                    >
                      <Button
                        onPress={async () => {
                          setLoading({ ...loading, [userId]: true });
                          await addToTeam(
                            currentTeamId,
                            userId,
                            waitlist[userId],
                          );
                          await removeWaitlist(currentTeamId, userId);
                          await invalidateMultipleKeys(
                            queryClient,
                            invalidateKeys,
                          );
                          setLoading({ ...loading, [userId]: false });
                        }}
                        textColor={"green"}
                      >
                        Accept
                      </Button>
                      <Button
                        onPress={async () => {
                          setLoading({ ...loading, [userId]: true });
                          await removeWaitlist(currentTeamId, userId);
                          await invalidateMultipleKeys(
                            queryClient,
                            invalidateKeys,
                          );
                          setLoading({ ...loading, [userId]: false });
                        }}
                        textColor={"red"}
                      >
                        Reject
                      </Button>
                    </View>
                  )}
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
