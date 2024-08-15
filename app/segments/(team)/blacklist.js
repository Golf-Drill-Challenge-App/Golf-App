import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, List } from "react-native-paper";
import { themeColors } from "~/Constants";
import { getErrorString } from "~/Utility";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import RefreshInvalidate from "~/components/refreshInvalidate";
import { useAuthContext } from "~/context/Auth";
import { useBlackList } from "~/dbOperations/hooks/useBlackList";
import { invalidateMultipleKeys } from "~/dbOperations/invalidateMultipleKeys";
import { removeBlacklist } from "~/dbOperations/removeBlacklist";

function Blacklist() {
  const {
    data: blacklist,
    error: blacklistError,
    isLoading: blacklistIsLoading,
  } = useBlackList();

  const { currentTeamId } = useAuthContext();

  const queryClient = useQueryClient(); // also called here for updating name

  const [unbanLoading, setUnbanLoading] = useState({});

  const invalidateKeys = [["blacklist"]];

  if (blacklistIsLoading) return <Loading />;

  if (blacklistError) return <ErrorComponent errorList={[blacklistError]} />;

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
        {Object.keys(blacklist).map((userId) => {
          return (
            <List.Item
              title={blacklist[userId].email}
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
                      try {
                        if (unbanLoading[userId]) return;
                        setUnbanLoading({ ...unbanLoading, [userId]: true });
                        await removeBlacklist(currentTeamId, userId);
                        await invalidateMultipleKeys(
                          queryClient,
                          invalidateKeys,
                        );
                        setUnbanLoading({ ...unbanLoading, [userId]: false });
                      } catch (e) {
                        console.log(e);
                        setUnbanLoading({ ...unbanLoading, [userId]: false });
                        showDialog("Error", getErrorString(e));
                      }
                    }}
                    textColor={themeColors.accent}
                    loading={unbanLoading[userId]}
                  >
                    Unban
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

export default Blacklist;
