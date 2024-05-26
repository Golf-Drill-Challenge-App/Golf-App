import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { doc, runTransaction } from "firebase/firestore";
import { useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Image } from "react-native-expo-image-cache";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { Appbar, Avatar, Button, List, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { themeColors } from "~/Constants";
import { getErrorString, getInitials } from "~/Utility";
import DialogComponent from "~/components/dialog";
import ErrorComponent from "~/components/errorComponent";
import Header from "~/components/header";
import Loading from "~/components/loading";
import PaperWrapper from "~/components/paperWrapper";
import { db } from "~/firebaseConfig";
import { invalidateMultipleKeys } from "~/hooks/invalidateMultipleKeys";
import { useUserInfo } from "~/hooks/useUserInfo";

export default function Index() {
  const {
    data: userInfo,
    error: userInfoError,
    isLoading: userIsLoading,
  } = useUserInfo();

  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const queryClient = useQueryClient();
  const [checkedItems, setCheckedItems] = useState({});
  if (userIsLoading) {
    return <Loading />;
  }
  if (userInfoError) {
    return <ErrorComponent errorList={[userInfoError]} />;
  }
  const filteredUserInfo = useMemo(() =>
    Object.fromEntries(
      Object.entries(userInfo)
        .filter(([, value]) => value.role === "player")
        .sort(([, a], [, b]) => a.name.localeCompare(b.name)),
      [userInfo],
    ),
  );

  const allTrue = useMemo(() => {
    if (Object.keys(checkedItems).length === 0) {
      return false;
    }
    return Object.values(checkedItems).every((value) => value === true);
  }, [checkedItems]);

  const handleAssignAll = () => {
    const updatedCheckedItems = {};
    Object.keys(filteredUserInfo).forEach((uid) => {
      updatedCheckedItems[uid] = !allTrue;
    });
    setCheckedItems(updatedCheckedItems);
  };

  const handleAssign = async () => {
    const selectedUsers = Object.entries(checkedItems)
      .filter(([, value]) => value)
      .map((value) => value[0]);
    const time = new Date().getTime();

    try {
      await runTransaction(db, async (transaction) => {
        const updatedAssignedData = {};

        for (const userId of selectedUsers) {
          const userRef = doc(db, "teams", "1", "users", userId);
          const docSnap = await transaction.get(userRef);
          if (docSnap.exists()) {
            const assignedData = docSnap.data()["assigned_data"];
            updatedAssignedData[userId] = [
              { assignedTime: time, completed: false, drillId: id },
              ...assignedData,
            ];
          } else {
            console.log("No such document!");
          }
        }
        selectedUsers.forEach((userId) => {
          const userRef = doc(db, "teams", "1", "users", userId);

          transaction.update(userRef, {
            assigned_data: updatedAssignedData[userId],
          });
        });
      });
      invalidateMultipleKeys(
        queryClient,
        selectedUsers.map((userId) => ["userInfo", { userId }]),
      );
    } catch (e) {
      //this will never ever show because of navigation.pop(3) below.I don't know if we should stick with the slow transaction above to show errors or navigate back and make it feel snappy, probably the former.
      showDialog("Error", getErrorString(e));
    }

    navigation.pop(3);
  };

  const showDialog = (title, message) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogVisible(true);
  };
  return (
    <PaperWrapper>
      <GestureHandlerRootView>
        <DialogComponent
          title={dialogTitle}
          content={dialogMessage}
          visible={dialogVisible}
          onHide={() => setDialogVisible(false)}
        />
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
                        {userData["pfp"] ? (
                          <Image
                            style={{
                              height: 24,
                              width: 24,
                              borderRadius: 12,
                            }}
                            uri={userData["pfp"]}
                          />
                        ) : (
                          <Avatar.Text
                            size={24}
                            label={getInitials(userData.name)}
                            color="white"
                            style={{ backgroundColor: themeColors.avatar }}
                          />
                        )}

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
          </View>
          <Button
            style={{
              margin: 10,
              bottom: 30,
              left: 0,
              right: 0,
            }}
            labelStyle={{
              fontSize: 20,
              fontWeight: "bold",
              padding: 5,
            }}
            mode="contained"
            buttonColor={themeColors.accent}
            textColor="white"
            onPress={handleAssign}
          >
            Assign
          </Button>
        </SafeAreaView>
      </GestureHandlerRootView>
    </PaperWrapper>
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
