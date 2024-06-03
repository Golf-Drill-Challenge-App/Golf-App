import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { Appbar, Icon, List, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "~/Constants";
import { getErrorString } from "~/Utility";
import ProfilePicture from "~/components/ProfilePicture";
import DialogComponent from "~/components/dialog";
import ErrorComponent from "~/components/errorComponent";
import Header from "~/components/header";
import Loading from "~/components/loading";
import PaperWrapper from "~/components/paperWrapper";
import RefreshInvalidate from "~/components/refreshInvalidate";
import { db } from "~/firebaseConfig";
import { invalidateMultipleKeys } from "~/hooks/invalidateMultipleKeys";
import { useDrillInfo } from "~/hooks/useDrillInfo";
import { useUserInfo } from "~/hooks/useUserInfo";

function Index() {
  const navigation = useNavigation();
  const { drillId, assignedTime } = useLocalSearchParams();
  const {
    data: drillInfo,
    isLoading: drillInfoIsLoading,
    error: drillInfoError,
  } = useDrillInfo({ drillId });
  const {
    data: userInfo,
    isLoading: userInfoIsLoading,
    error: userInfoError,
  } = useUserInfo({ role: "player" });
  const invalidateKeys = [
    ["userInfo", { role: "player" }],
    ["drillInfo", { drillId }],
  ];

  const queryClient = useQueryClient();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");

  const showDialog = (title, message) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogVisible(true);
  };

  const playerList = useMemo(() => {
    if (!userInfo) return [];
    return Object.values(userInfo)
      .filter((user) =>
        user.assigned_data.some(
          (assignment) =>
            assignment.assignedTime == assignedTime &&
            assignment.drillId === drillId,
        ),
      )
      .map((user) => {
        const assignment = user.assigned_data.find(
          (assignment) =>
            assignment.assignedTime == assignedTime &&
            assignment.drillId === drillId,
        );
        return {
          name: user.name,
          pfp: user.pfp,
          role: user.role,
          uid: user.uid,
          completed: assignment.completed,
          attemptId: assignment.attemptId,
        };
      });
  }, [userInfo, assignedTime, drillId]);

  const numCompleted = useMemo(() => {
    return playerList.filter((assignment) => assignment.completed).length;
  }, [playerList]);

  if (drillInfoIsLoading || userInfoIsLoading) return <Loading />;

  if (drillInfoError || userInfoError) {
    return <ErrorComponent errorList={[drillInfoError, userInfoError]} />;
  }

  const handleAssignmentPress = async (assignment) => {
    if (!assignment.attemptId) {
      //terminator code
      try {
        const userRef = doc(db, "teams", "1", "users", assignment.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const assignedData = docSnap.data().assigned_data;
          const updatedAssignedData = assignedData.map((a) => {
            if (a.assignedTime == assignedTime && a.drillId === drillId) {
              return { ...a, completed: false };
            }
            return a;
          });

          await updateDoc(userRef, { assigned_data: updatedAssignedData });
          console.log("Assigned Data Document updated successfully!");
          await invalidateMultipleKeys(queryClient, invalidateKeys);
        } else {
          console.log("No such Assigned Data Document!");
        }
      } catch (e) {
        console.log(e);
        showDialog("Error", getErrorString(e));
      }
    } else {
      router.push({
        pathname: `content/assignments/attempts/${assignment.attemptId}`,
        params: {
          id: drillId,
        },
      });
    }
  };

  return (
    <PaperWrapper>
      <DialogComponent
        title={dialogTitle}
        content={dialogMessage}
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
      />
      <SafeAreaView
        // flex: without this the scrollview automatically scrolls back up when finger no longer held down
        style={{ flex: 1 }}
        forceInset={{ top: "always" }}
        // edges: to remove bottom padding above tabbar. Maybe move this (and PaperProvider) into app/_layout.js?
        edges={["right", "top", "left"]}
      >
        <Header
          title={drillInfo["subType"]}
          subTitle={drillInfo["drillType"]}
          preChildren={
            <Appbar.BackAction
              onPress={() => {
                navigation.goBack();
              }}
              color={themeColors.accent}
            />
          }
        />
        <Text style={{ textAlign: "center", marginBottom: 10 }}>
          {numCompleted} / {playerList.length} completed
        </Text>
        <ScrollView
          refreshControl={<RefreshInvalidate invalidateKeys={invalidateKeys} />}
        >
          <View
            style={{
              backgroundColor: themeColors.background,
              paddingBottom: 10,
              paddingTop: 10,
            }}
          >
            <List.Section style={{ backgroundColor: themeColors.background }}>
              {playerList.map((assignment) => {
                return (
                  <List.Item
                    key={`${assignment.uid}`}
                    onPress={() => handleAssignmentPress(assignment)}
                    disabled={!assignment.completed}
                    style={{
                      paddingLeft: 20,
                    }}
                    left={() => (
                      <ProfilePicture
                        userInfo={assignment}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                        }}
                      />
                    )}
                    right={() => (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        {assignment.completed && (
                          <>
                            <Text
                              style={{
                                color: "green",
                              }}
                            >
                              Completed
                            </Text>
                            <Icon size={20} source="chevron-right" />
                          </>
                        )}
                      </View>
                    )}
                    title={assignment.name}
                  />
                );
              })}
            </List.Section>
          </View>
        </ScrollView>
      </SafeAreaView>
    </PaperWrapper>
  );
}

export default Index;
