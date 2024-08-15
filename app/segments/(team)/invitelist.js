import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Button, List } from "react-native-paper";
import { themeColors } from "~/Constants";
import { getErrorString } from "~/Utility";
import DialogComponent from "~/components/dialog";
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

  const invitedEmail = useMemo(() => {
    if (invitelist)
      return Object.values(invitelist).map((invite) => invite["email"]);
  }, [invitelist]);

  const invalidateKeys = [["invitelist"]];

  const [currentEmailInput, setCurrentEmailInput] = useState("");
  const [currentEmailValid, setCurrentEmailValid] = useState(false);
  const [statusText, setStatusText] = useState("");

  const [removeLoading, setRemoveLoading] = useState({});
  const [inviteLoading, setInviteLoading] = useState(false);

  const [removeCounter, setRemoveCounter] = useState(0);

  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const onInvite = async () => {
    if (inviteLoading) return;
    setInviteLoading(true);
    if (invitedEmail.includes(currentEmailInput)) {
      setStatusText("Email already invited");
      return;
    }
    await addToInvitelist(currentTeamId, currentEmailInput);
    setCurrentEmailInput("");
    setCurrentEmailValid(false);
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
      <DialogComponent
        type={"snackbar"}
        visible={snackbarVisible}
        content={`Unbanned ${removeCounter} user${removeCounter > 1 ? "s" : ""}`}
        onHide={() => {
          setSnackbarVisible(false);
          setRemoveCounter(0);
        }}
      />
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
                        setRemoveCounter((prev) => prev + 1);
                        setSnackbarVisible(true);
                        setRemoveLoading({
                          ...removeLoading,
                          [inviteId]: false,
                        });
                      }}
                      height={38} //so the button doesn't change size because of the spinner
                      textColor={themeColors.accent}
                      loading={removeLoading[inviteId]}
                    >
                      Remove
                    </Button>
                  </View>
                )}
              />
            );
          })}
        </List.Section>
      </ScrollView>
      <Text>{statusText}</Text>
      <View
        style={{
          flexDirection: "row",
          padding: 5,
          paddingLeft: 20,
          paddingRight: 35,
        }}
      >
        <TextInput
          value={currentEmailInput}
          onChangeText={(text) => {
            setCurrentEmailInput(text);
            const included = invitedEmail.includes(text);
            if (included) setStatusText("Email already invited");
            else setStatusText("");

            setCurrentEmailValid(!included && emailRegex.test(text));
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
          loading={inviteLoading}
        >
          Invite
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

export default Invitelist;
