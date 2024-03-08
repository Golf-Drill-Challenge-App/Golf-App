import { Feather } from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { router, useNavigation } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Image,
  Keyboard,
  Pressable,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Appbar,
  Avatar,
  Button,
  Icon,
  List,
  PaperProvider,
  Searchbar,
  Text,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import db from "~/firebaseConfig";

function Index() {
  const navigation = useNavigation();
  // const users = drillData["teams"]["1"]["users"];
  const [users, setUsers] = React.useState([]);

  const usersRef = collection(db, "teams", "1", "users");

  useEffect(() => {
    getDocs(usersRef).then((querySnapshot) => {
      let newUsers = [];
      querySnapshot.forEach((doc) => {
        newUsers.push(doc.data());
      });
      setUsers(newUsers);
    });
  }, []);

  const [searchQuery, setSearchQuery] = React.useState("");

  const onChangeSearch = (query) => setSearchQuery(query);

  const foundUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  console.log("Found: ", foundUsers);

  // ref
  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <PaperProvider>
      <SafeAreaView
        // flex: without this the scrollview automatically scrolls back up when finger no longer held down
        style={{ flex: 1 }}
        forceInset={{ top: "always" }}
        // edges: to remove bottom padding above tabbar. Maybe move this (and PaperProvider) into app/_layout.js?
        edges={["right", "top", "left"]}
      >
        <TouchableWithoutFeedback
          // dismiss keyboard after tapping outside of search bar input
          onPress={Keyboard.dismiss}
          accessible={false}
        >
          <>
            <Appbar.Header
              statusBarHeight={0}
              style={{ backgroundColor: "FFF" }}
            >
              <Appbar.Content title={"Team"} />
            </Appbar.Header>
            <BottomSheetModalProvider>
              <KeyboardAwareScrollView
                style={{ marginLeft: 20 }}
                // allows opening links from search results without closing keyboard first
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[3]}
              >
                <View style={{ alignItems: "center" }}>
                  <Image
                    source={{
                      uri: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Oregon_State_Beavers_logo.svg/1200px-Oregon_State_Beavers_logo.svg.png",
                      resizeMode: "contain",
                      width: 131,
                      height: 75,
                    }}
                    style={{ marginTop: 0 }}
                  />
                </View>
                <View style={{ alignItems: "center" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "baseline",
                    }}
                  >
                    <Text
                      style={{ marginTop: 0, fontSize: 30, marginRight: 0 }}
                    >
                      OSU Golf Team
                    </Text>
                    <Button
                      onPress={handlePresentModalPress}
                      size={24}
                      style={{ width: 10 }}
                      // react native buttons and icons don't play well together: https://stackoverflow.com/a/70038112
                      icon={({ size, color }) => (
                        <Feather
                          name="settings"
                          size={24}
                          color="#F24E1E"
                          style={{ paddingBottom: 3 }}
                        ></Feather>
                      )}
                    ></Button>

                    <BottomSheetModal
                      ref={bottomSheetModalRef}
                      index={1}
                      snapPoints={snapPoints}
                      onChange={handleSheetChanges}
                    >
                      <View>
                        <Pressable
                          onPress={() => {
                            bottomSheetModalRef.current.close();
                          }}
                          //width={"100%"}
                          //alignItems={"center"}
                        >
                          <Text
                            style={{
                              textAlign: "left",
                              marginLeft: 5,
                              fontSize: 15,
                              color: "red",
                            }}
                          >
                            Cancel
                          </Text>
                        </Pressable>
                        <Text
                          style={{
                            textAlign: "center",
                            fontSize: 20,
                            marginTop: 0,
                          }}
                        >
                          Team Settings
                        </Text>
                      </View>
                    </BottomSheetModal>
                  </View>
                </View>

                <Text style={{ textAlign: "center", marginBottom: 20 }}>
                  {Object.keys(users).length} members
                </Text>
                <View
                  style={{
                    // default react native background color or something, so stuff scrolling behind this is less jank
                    backgroundColor: "#f2f2f2",
                    paddingBottom: 10,
                    paddingTop: 10,
                  }}
                >
                  <Searchbar
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    style={{ paddingLeft: 20, paddingRight: 20 }}
                  />
                </View>

                <List.Section>
                  {foundUsers.map((user, i) => {
                    const userid =
                      user.uid["_key"] !== undefined
                        ? user.uid["_key"]["path"]["segments"].at(-1)
                        : "awefr";
                    console.log("userid: ", userid);
                    return (
                      <List.Item
                        key={userid}
                        title={user.name}
                        left={() => (
                          <Avatar.Image
                            size={24}
                            source={{
                              uri: user.pfp,
                            }}
                          />
                        )}
                        right={() => (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              height: 16,
                            }}
                          >
                            <Text>{user.role}</Text>
                            <Icon source="chevron-right" />
                          </View>
                        )}
                        onPress={() =>
                          router.push(`content/team/users/${userid}`)
                        }
                      />
                    );
                  })}
                </List.Section>
              </KeyboardAwareScrollView>
            </BottomSheetModalProvider>
          </>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </PaperProvider>
  );
}

export default Index;
