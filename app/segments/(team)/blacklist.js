import { useQueryClient } from "@tanstack/react-query";
import { ScrollView, View } from "react-native";
import { Button, List } from "react-native-paper";
import { themeColors } from "~/Constants";
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
                      await removeBlacklist(currentTeamId, userId);
                      await invalidateMultipleKeys(queryClient, invalidateKeys);
                    }}
                    textColor={themeColors.accent}
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