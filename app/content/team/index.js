import React, { useCallback, useMemo, useRef } from "react";
import drillData from "~/drill_data.json";
import { Image, View, Pressable } from "react-native";
import {
  Text,
  Button,
  List,
  Appbar,
  Icon,
  Avatar,
  Searchbar,
  PaperProvider,
} from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useNavigation } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function Index() {
  const navigation = useNavigation();
  const users = drillData["users"];

  const [searchQuery, setSearchQuery] = React.useState("");

  const onChangeSearch = (query) => setSearchQuery(query);

  const foundUsers = Object.values(users).filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <SafeAreaView style={{ flex: 1 }} edges={["right", "top", "left"]}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Appbar.Header
              statusBarHeight={0}
              style={{ backgroundColor: "FFF" }}
            >
              <Appbar.BackAction
                onPress={() => {
                  navigation.goBack();
                }}
                color={"#F24E1E"}
              />
              <Appbar.Content title={"Team"} />
            </Appbar.Header>
            <BottomSheetModalProvider>
              <View style={{ alignItems: "center" }}>
                <Image
                  source={{
                    uri: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Oregon_State_Beavers_logo.svg/1200px-Oregon_State_Beavers_logo.svg.png",
                    resizeMode: "contain",
                    width: 131,
                    height: 75,
                  }}
                  style={{ marginTop: 20 }}
                />
              </View>
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "baseline",
                  }}
                >
                  <Text style={{ marginTop: 25, fontSize: 30, marginRight: 0 }}>
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
                          marginTop: 20,
                        }}
                      >
                        Team Settings
                      </Text>
                    </View>
                  </BottomSheetModal>
                </View>
              </View>

              <Text style={{ textAlign: "center" }}>
                {Object.keys(users).length} members
              </Text>

              <Searchbar
                placeholder="Search"
                onChangeText={onChangeSearch}
                value={searchQuery}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 20 }}
              />

              <KeyboardAwareScrollView
                style={{ marginTop: 20, marginLeft: 20 }}
                keyboardShouldPersistTaps="handled"
              >
                <List.Section>
                  {foundUsers.map((user, i) => {
                    return (
                      <List.Item
                        key={user.uid}
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
                            }}
                          >
                            <Text>{user.role}</Text>
                            <Icon source="chevron-right" />
                          </View>
                        )}
                        onPress={() =>
                          router.push(`content/team/users/${user.uid}`)
                        }
                      />
                    );
                  })}
                </List.Section>
              </KeyboardAwareScrollView>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </PaperProvider>
  );
}

export default Index;
