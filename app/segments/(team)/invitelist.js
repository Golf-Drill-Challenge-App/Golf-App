import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { ActivityIndicator, Button, List } from "react-native-paper";
import { themeColors } from "~/Constants";
import { getErrorString } from "~/Utility";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import RefreshInvalidate from "~/components/refreshInvalidate";
import { useAuthContext } from "~/context/Auth";
import { addToInvitelist } from "~/dbOperations/addToInvitelist";
import { useInvitelist } from "~/dbOperations/hooks/useInviteList";
import { invalidateMultipleKeys } from "~/dbOperations/invalidateMultipleKeys";
import { removeInvitelist } from "~/dbOperations/removeInvitelist";

export function Invitelist() {
  const {
    data: invitelist,
    error: inviteError,
    isLoading: inviteIsLoading,
  } = useInvitelist();

  const queryClient = useQueryClient();

  const { currentTeamId } = useAuthContext();

  const invalidateKeys = [["invitelist"]];
  // const queryClient = useQueryClient();

  const [currentEmailInput, setCurrentEmailInput] = useState("");
  const [currentEmailValid, setCurrentEmailValid] = useState(false);

  const [removeLoading, setRemoveLoading] = useState({});
  const [inviteLoading, setInviteLoading] = useState(false);

  const onInvite = async () => {
    setInviteLoading(true);
    const invitedEmail = Object.values(invitelist).map(
      (invite) => invite["email"],
    );
    if (invitedEmail.includes(currentEmailInput)) {
    }
    await addToInvitelist(currentTeamId, currentEmailInput);
    setCurrentEmailInput("");
    await invalidateMultipleKeys(queryClient, invalidateKeys);
    setInviteLoading(false);
  };

  if (inviteError) {
    return <ErrorComponent error={getErrorString(inviteError)} />;
  }

  if (inviteIsLoading) {
    return <Loading />;
  }

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w\w+)+$/;

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
      }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        refreshControl={<RefreshInvalidate invalidateKeys={invalidateKeys} />}
      >
        <List.Section
          style={{
            margin: 5,
            borderRadius: 5,
          }}
        >
          {Object.keys(invitelist).map((inviteId) => {
            return (
              <List.Item
                title={invitelist[inviteId].email}
                key={inviteId}
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
                        setRemoveLoading({
                          ...removeLoading,
                          [inviteId]: true,
                        });
                        await removeInvitelist(currentTeamId, inviteId);
                        await invalidateMultipleKeys(
                          queryClient,
                          invalidateKeys,
                        );
                        setRemoveLoading({
                          ...removeLoading,
                          [inviteId]: false,
                        });
                      }}
                      height={38} //so the button doesn't change size because of the spinner
                      textColor={themeColors.accent}
                    >
                      {removeLoading[inviteId] ? (
                        <ActivityIndicator color={themeColors.accent} />
                      ) : (
                        "Remove"
                      )}
                    </Button>
                  </View>
                )}
              />
            );
          })}
        </List.Section>
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          padding: 5,
        }}
      >
        <TextInput
          value={currentEmailInput}
          onChangeText={(text) => {
            setCurrentEmailInput(text);
            setCurrentEmailValid(emailRegex.test(text));
          }}
          autoCapitalize={"none"}
          autoComplete={"email"}
          autoCorrect={false}
          inputMode={"email"}
          keyboardType={"email-address"}
          placeholder={"Enter email to invite"}
          style={{
            flexGrow: 1,
          }}
        />
        <Button
          disabled={!currentEmailValid}
          onPress={onInvite}
          textColor={themeColors.accent}
        >
          {inviteLoading ? (
            <ActivityIndicator color={themeColors.accent} />
          ) : (
            "Invite"
          )}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

export default Invitelist;
