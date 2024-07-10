import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { doc, runTransaction } from "firebase/firestore";
import { useCallback, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  ActivityIndicator,
  Appbar,
  Button,
  List,
  Text,
  TouchableRipple,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { debounce } from "underscore";
import { themeColors } from "~/Constants";
import { getErrorString } from "~/Utility";
import ProfilePicture from "~/components/ProfilePicture";
import EmptyScreen from "~/components/emptyScreen";
import ErrorComponent from "~/components/errorComponent";
import Header from "~/components/header";
import Loading from "~/components/loading";
import { useAlertContext } from "~/context/Alert";
import { useAuthContext } from "~/context/Auth";
import { useTimeContext } from "~/context/Time";
import { db } from "~/firebaseConfig";
import { invalidateMultipleKeys } from "~/hooks/invalidateMultipleKeys";
import { useUserInfo } from "~/hooks/useUserInfo";

export default function Index() {
  const {
    data: userInfo,
    error: userInfoError,
    isLoading: userIsLoading,
  } = useUserInfo();

  const { currentTeamId } = useAuthContext();

  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const { showDialog, showSnackBar } = useAlertContext();

  const { getCurrentLocalizedDate, getLocalizedDate } = useTimeContext();

  const [checkedItems, setCheckedItems] = useState({});
  const filteredUserInfo = useMemo(() => {
    const isAssignedToday = (assignedTime) => {
      const today = getCurrentLocalizedDate({ rounded: true }).getTime();
      const assignedDate = getLocalizedDate({
        time: assignedTime,
        rounded: true,
      }).getTime();
      return today === assignedDate;
    };
    return Object.fromEntries(
      Object.entries(userInfo ?? {})
        .filter(([, value]) => {
          const hasDrillAssignedToday = value.assigned_data?.some(
            (assignment) =>
              assignment.drillId === id &&
              isAssignedToday(assignment.assignedTime),
          );
          return value.role === "player" && !hasDrillAssignedToday;
        })
        .sort(([, a], [, b]) => a.name.localeCompare(b.name)),
    );
  }, [getCurrentLocalizedDate, getLocalizedDate, id, userInfo]);

  const allTrue = useMemo(() => {
    if (Object.keys(checkedItems).length === 0) {
      return false;
    }
    return Object.values(checkedItems).every((value) => value === true);
  }, [checkedItems]);
  const someTrue = useMemo(() => {
    if (Object.keys(checkedItems).length === 0) {
      return false;
    }
    return Object.values(checkedItems).some((value) => value === true);
  }, [checkedItems]);
  if (userIsLoading) {
    return <Loading />;
  }
  if (userInfoError) {
    return <ErrorComponent errorList={[userInfoError]} />;
  }

  const handleAssignAll = () => {
    const updatedCheckedItems = {};
    Object.keys(filteredUserInfo).forEach((uid) => {
      updatedCheckedItems[uid] = !allTrue;
    });
    setCheckedItems(updatedCheckedItems);
  };

  const handleAssign = useCallback(
    debounce(
      async () => {
        setLoading(true);
        const selectedUsers = Object.entries(checkedItems)
          .filter(([, value]) => value)
          .map((value) => value[0]);
        const time = Date.now();

        try {
          await runTransaction(db, async (transaction) => {
            const updatedAssignedData = {};

            for (const userId of selectedUsers) {
              const userRef = doc(db, "teams", currentTeamId, "users", userId);
              const docSnap = await transaction.get(userRef);
              if (docSnap.exists()) {
                const assignedData = docSnap.data()["assigned_data"];
                updatedAssignedData[userId] = [
                  { assignedTime: time, completed: false, drillId: id },
                  ...assignedData,
                ];
              } else {
                console.log("No such Assigned Data document!");
              }
            }
            selectedUsers.forEach((userId) => {
              const userRef = doc(db, "teams", currentTeamId, "users", userId);

              transaction.update(userRef, {
                assigned_data: updatedAssignedData[userId],
              });
            });
          });
          await invalidateMultipleKeys(queryClient, [["userInfo"]]);
          showSnackBar("Assignment Successful");
          navigation.pop(3);
        } catch (e) {
          //this will never ever show because of navigation.pop(3) below.I don't know if we should stick with the slow transaction above to show errors or navigate back and make it feel snappy, probably the former.
          showDialog("Error", getErrorString(e));
        }

        setLoading(false);
      },
      1000,
      true,
    ),
    [checkedItems],
  );

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["right", "top", "left"]}>
      <Header
        title="Assign Drill"
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
            onPress={handleAssignAll}
          >
            <Text style={{ color: themeColors.accent, fontSize: 17 }}>
              {allTrue ? "Unassign All" : "Assign All"}
            </Text>
          </Button>
        }
      />
      <View style={{ flex: 1 }}>
        {Object.keys(filteredUserInfo).length > 0 ? (
          <ScrollView style={{ flex: 1, marginBottom: 30 }}>
            <List.Section style={{ paddingHorizontal: 20, height: "100%" }}>
              {Object.entries(filteredUserInfo).map(([uid, userData]) => (
                <TouchableOpacity
                  key={uid}
                  style={styles.cardContainer}
                  activeOpacity={0.5}
                  onPress={() =>
                    setCheckedItems({
                      ...checkedItems,
                      [uid]: !checkedItems[uid],
                    })
                  }
                >
                  <View style={styles.cardContent}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 20,
                      }}
                    >
                      <ProfilePicture
                        style={{
                          height: 24,
                          width: 24,
                          borderRadius: 12,
                        }}
                        userInfo={userData}
                      />

                      <Text style={styles.title}>{userData.name}</Text>
                    </View>
                    <View style={styles.specContainer}>
                      {checkedItems[uid] ? (
                        <Icon name="checkbox-outline" size={20} />
                      ) : (
                        <Icon name="checkbox-blank-outline" size={20} />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </List.Section>
          </ScrollView>
        ) : (
          <EmptyScreen
            text={
              "No players left to assign.\nYou can only assign this drill to players who have not been assigned today."
            }
          />
        )}
      </View>
      <TouchableRipple
        rippleColor="rgba(256, 256, 256, 0.2)"
        borderless={true}
        style={{
          margin: 10,
          bottom: 30,
          left: 0,
          right: 0,
          backgroundColor: someTrue ? themeColors.accent : "#A0A0A0",
          padding: 10,
          justifyContent: "center",
          borderRadius: 20,
          flexDirection: "row",
        }}
        disabled={!someTrue}
        onPress={handleAssign}
      >
        {loading ? (
          <ActivityIndicator animating={true} color={"#FFF"} />
        ) : (
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
            Assign
          </Text>
        )}
      </TouchableRipple>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 1,
    borderColor: themeColors.border,
    borderRadius: 8,
    marginVertical: 5,
    paddingHorizontal: 20,
    padding: 10, // Decrease the padding to make the height smaller
    backgroundColor: "#fff",
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    color: "#333",
  },
  specContainer: {
    flexDirection: "row", // Add flexDirection: 'row' to center the checkmark vertically
    alignItems: "center", // Add alignItems: 'center' to center the checkmark vertically
  },
});
