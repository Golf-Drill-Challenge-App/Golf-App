import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { signOut as signoutFireBase } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Text, View } from "react-native";
import {
  Button,
  PaperProvider,
  Surface,
  TouchableRipple,
} from "react-native-paper";
import { themeColors } from "~/Constants";
import DialogComponent from "~/components/dialog";
import EmptyScreen from "~/components/emptyScreen";
import { currentAuthContext } from "~/context/Auth";
import { auth, db } from "~/firebaseConfig";
import { invalidateMultipleKeys } from "~/hooks/invalidateMultipleKeys";

function ChooseTeam() {
  const { signOut, currentUserId, currentUserInfo, setCurrentUserId } =
    currentAuthContext();
  const queryClient = useQueryClient();
  async function handleSignOut() {
    try {
      await signoutFireBase(auth);
      signOut();
    } catch (e) {
      alert(e);
      console.log(e);
    }
  }

  const [dialogVisible, setDialogVisible] = useState(false);
  const hideDialog = () => setDialogVisible(false);

  return (
    <PaperProvider>
      <EmptyScreen
        text={"Choose a team"}
        postChild={() => (
          <>
            <View
              style={{
                flexGrow: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Surface
                style={{
                  borderRadius: 10,
                  elevation: 10,
                }}
              >
                <TouchableRipple
                  onPress={async () => {
                    const blacklistDoc = await getDoc(
                      doc(db, "teams", "1", "blacklist", currentUserId),
                    );
                    if (blacklistDoc.exists()) {
                      setDialogVisible(true);
                    } else {
                      await setDoc(
                        doc(db, "teams", "1", "users", currentUserId),
                        {
                          name: currentUserInfo["displayName"],
                          // hardcoded pfp string for now, add pfp upload to profile settings in future PR
                          pfp: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                          // hardcoded "player" role for now, add role selection to profile settings in future PR
                          role: "player",
                          uid: currentUserId,
                          assigned_data: [],
                          uniqueDrills: [],
                        },
                      );
                      setCurrentUserId(currentUserId);
                      invalidateMultipleKeys(queryClient, [
                        ["userInfo", { userId: currentUserId }],
                      ]);
                      router.replace("/");
                      rippleColor = "rgba(0, 0, 0, 0.2)";
                    }
                  }}
                  style={{
                    backgroundColor: themeColors.accent,
                    padding: 50,
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  <Text
                    style={{
                      color: themeColors.highlight,
                    }}
                  >
                    Join Team
                  </Text>
                </TouchableRipple>
              </Surface>
            </View>
            <View
              style={{
                flexGrow: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                onPress={handleSignOut}
                style={{
                  backgroundColor: themeColors.accent,
                }}
              >
                <Text
                  style={{
                    color: themeColors.highlight,
                  }}
                >
                  Sign Out
                </Text>
              </Button>
              <DialogComponent
                title={"Error!"}
                content="You have been banned from this team and cannot rejoin."
                visible={dialogVisible}
                onHide={hideDialog}
                buttons={["Ok"]}
                buttonsFunctions={[
                  () => {
                    hideDialog();
                  },
                ]}
              />
            </View>
          </>
        )}
      />
    </PaperProvider>
  );
}

export default ChooseTeam;
