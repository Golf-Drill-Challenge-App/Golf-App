import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { doc, getDoc, runTransaction, updateDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { Appbar, Button, Icon, List, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "~/Constants";
import { getErrorString } from "~/Utility";
import ProfilePicture from "~/components/ProfilePicture";
import ErrorComponent from "~/components/errorComponent";
import Header from "~/components/header";
import Loading from "~/components/loading";
import RefreshInvalidate from "~/components/refreshInvalidate";
import { useAlertContext } from "~/context/Alert";
import { useAuthContext } from "~/context/Auth";
import { useTimeContext } from "~/context/Time";
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

  const { currentTeamId } = useAuthContext();

  const queryClient = useQueryClient();

  const { showDialog, showSnackBar } = useAlertContext();

  const [editing, setEditing] = useState(false);

  const [assignmentList, setAssignmentList] = useState([]);

  const { getLocalizedDate } = useTimeContext();

  useEffect(() => {
    if (!userInfo || userInfoIsLoading) setAssignmentList([]);
    else {
      const critera = (assignment) =>
        getLocalizedDate({
          time: assignment.assignedTime,
          rounded: true,
        }).getTime() == assignedTime && assignment.drillId === drillId;
      setAssignmentList(
        Object.values(userInfo)
          .filter((user) => user.assigned_data.some(critera))
          .map((user) => {
            const assignment = user.assigned_data.find(critera);
            return {
              name: user.name,
              pfp: user.pfp,
              role: user.role,
              uid: user.uid,
              completed: assignment.completed,
              attemptId: assignment.attemptId,
              markedForDelete: false,
            };
          }),
      );
    }
  }, [
    userInfo,
    getLocalizedDate,
    assignedTime,
    drillId,
    assignmentList.length,
    navigation,
    userInfoIsLoading,
  ]);

  const allMarked = useMemo(() => {
    return assignmentList.every((assignment) => assignment.markedForDelete);
  }, [assignmentList]);

  const numCompleted = useMemo(() => {
    return assignmentList.filter((assignment) => assignment.completed).length;
  }, [assignmentList]);

  if (drillInfoIsLoading || userInfoIsLoading) return <Loading />;

  if (drillInfoError || userInfoError) {
    return <ErrorComponent errorList={[drillInfoError, userInfoError]} />;
  }

  const unMarkAll = () => {
    setAssignmentList((prevAssignmentList) => {
      return prevAssignmentList.map((prevAssignment) => {
        return {
          ...prevAssignment,
          markedForDelete: false,
        };
      });
    });
  };

  const handleAssignmentPress = async (assignment) => {
    if (!assignment.attemptId) {
      //terminator code
      try {
        const userRef = doc(
          db,
          "teams",
          currentTeamId,
          "users",
          assignment.uid,
        );
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
        postChildren={
          <Button
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 10,
            }}
            onPress={() => {
              setEditing(!editing);
              if (editing) {
                unMarkAll();
              }
            }}
          >
            <Text style={{ color: themeColors.accent, fontSize: 17 }}>
              {editing ? "Cancel" : "Edit"}
            </Text>
          </Button>
        }
      />

      {editing ? (
        //select all
        <Button
          mode={"text"}
          style={{
            margin: 0,
            padding: 0,
          }}
          textColor={themeColors.accent}
          onPress={() => {
            setAssignmentList((prevAssignmentList) => {
              return prevAssignmentList.map((prevAssignment) => {
                return {
                  ...prevAssignment,
                  markedForDelete: !allMarked,
                };
              });
            });
          }}
        >
          {allMarked ? "Unselect All" : "Select All"}
        </Button>
      ) : (
        <Text style={{ textAlign: "center", marginVertical: 10 }}>
          {numCompleted} / {assignmentList.length} completed
        </Text>
      )}
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
            {assignmentList.map((assignment) => {
              return (
                <List.Item
                  key={`${assignment.uid}`}
                  onPress={async () => {
                    if (editing) {
                      //toggle markedForDelete
                      setAssignmentList((prevAssignmentList) => {
                        return prevAssignmentList.map((prevAssignment) => {
                          if (prevAssignment.uid === assignment.uid) {
                            return {
                              ...prevAssignment,
                              markedForDelete: !prevAssignment.markedForDelete,
                            };
                          }
                          return prevAssignment;
                        });
                      });
                    } else {
                      await handleAssignmentPress(assignment);
                    }
                  }}
                  disabled={
                    !editing && (!assignment.completed || !drillInfo.hasStats)
                  }
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
                      {editing ? (
                        assignment.markedForDelete ? (
                          <Icon
                            source="checkbox-outline"
                            size={20}
                            color={"black"}
                          />
                        ) : (
                          <Icon
                            source="checkbox-blank-outline"
                            size={20}
                            color={"black"}
                          />
                        )
                      ) : (
                        assignment.completed && (
                          <>
                            <Text
                              style={{
                                color: "green",
                              }}
                            >
                              Completed
                            </Text>
                            {drillInfo.hasStats && (
                              <Icon size={20} source="chevron-right" />
                            )}
                          </>
                        )
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
      {editing && (
        <View>
          <Button
            style={{
              margin: 10,
            }}
            labelStyle={{
              fontSize: 20,
              fontWeight: "bold",
              padding: 5,
            }}
            mode="contained"
            buttonColor={themeColors.accent}
            textColor="white"
            disabled={
              !assignmentList.some((assignment) => assignment.markedForDelete)
            }
            theme={{
              colors: {
                surfaceDisabled: "#A0A0A0",
                onSurfaceDisabled: "#FFF",
              },
            }}
            onPress={async () => {
              try {
                await runTransaction(db, async (transaction) => {
                  const playerList = [];
                  for (const assignment of assignmentList) {
                    if (!assignment.markedForDelete) {
                      continue;
                    }
                    const userRef = doc(
                      db,
                      "teams",
                      currentTeamId,
                      "users",
                      assignment.uid,
                    );
                    console.log("Players marked for delete: ", assignment.uid);
                    const docSnap = await transaction.get(userRef);

                    if (docSnap.exists()) {
                      const assignedData = docSnap.data().assigned_data;
                      const updatedAssignmentList = assignedData.filter(
                        (assignment) =>
                          getLocalizedDate({
                            time: assignment.assignedTime,
                            rounded: true,
                          }).getTime() != assignedTime,
                      );
                      console.log(
                        "Updated Assignment List: ",
                        updatedAssignmentList,
                      );
                      console.log("current assignedTime: ", assignedTime);
                      playerList.push({
                        uid: assignment.uid,
                        assigned_data: updatedAssignmentList,
                      });
                    }
                  }

                  for (const player of playerList) {
                    const userRef = doc(
                      db,
                      "teams",
                      currentTeamId,
                      "users",
                      player.uid,
                    );
                    await transaction.update(userRef, {
                      ["assigned_data"]: player.assigned_data,
                    });
                  }
                });
                await invalidateMultipleKeys(queryClient, invalidateKeys);
                showSnackBar("Assignments Deleted");
              } catch (e) {
                console.log("Error deleting assignments: ", e);
                showDialog("Error", getErrorString(e));
              }
            }}
          >
            Delete
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}

export default Index;
