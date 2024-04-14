import { router } from "expo-router";
import { useState } from "react";
import { Image, Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Appbar,
  Avatar,
  Icon,
  List,
  PaperProvider,
  Searchbar,
  Text,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import RefreshInvalidate from "~/components/refreshInvalidate";
import { currentAuthContext } from "~/context/Auth";
import { useUserInfo } from "~/hooks/useUserInfo";

function Index() {
  const { currentUserId } = currentAuthContext();
  const { data: userInfo, userIsLoading, userError } = useUserInfo();
  const invalidateKeys = [["user"]];
  const [searchQuery, setSearchQuery] = useState("");

  const onChangeSearch = (query) => setSearchQuery(query);

  if (userIsLoading) return <Loading />;

  if (userError) return <ErrorComponent message={userError.message} />;
  const foundUsers = Object.values(userInfo)
    .filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((user1, user2) => {
      // Assign priorities based on conditions
      const getPriority = (user) => {
        if (user["uid"] === currentUserId) {
          return 0; // Highest priority
        } else if (user.role === "owner") {
          return 1;
        } else if (user.role === "player") {
          return 2;
        } else if (user.role === "coach") {
          return 3;
        } else {
          return 4; // Fallback
        }
      };

      const priority1 = getPriority(user1);
      const priority2 = getPriority(user2);

      // First, compare by priority
      if (priority1 !== priority2) {
        return priority1 - priority2;
      }

      // If priorities are the same, then sort alphabetically by name
      return user1.name.localeCompare(user2.name);
    });

  const roleColor = (user) =>
    user["uid"] === currentUserId
      ? "#F24F1D"
      : user.role === "owner"
        ? "#3366ff"
        : "#222";

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
            <KeyboardAwareScrollView
              style={{ marginLeft: 20 }}
              // allows opening links from search results without closing keyboard first
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              stickyHeaderIndices={[3]}
              refreshControl={
                <RefreshInvalidate invalidateKeys={invalidateKeys} />
              }
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
                  <Text style={{ marginTop: 0, fontSize: 30, marginRight: 0 }}>
                    OSU Golf Team
                  </Text>
                </View>
              </View>

              <Text style={{ textAlign: "center", marginBottom: 20 }}>
                {Object.keys(userInfo).length} members
              </Text>
              <View
                style={{
                  // default react native background color or something, so stuff scrolling behind this is less jank
                  backgroundColor: themeColors.background,
                  paddingBottom: 10,
                  paddingTop: 10,
                }}
              >
                <Searchbar
                  onChangeText={onChangeSearch}
                  value={searchQuery}
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    backgroundColor: "#fff",
                    borderWidth: 1,
                    borderColor: themeColors.border,
                  }}
                  placeholder="Search team members"
                />
              </View>

              <List.Section>
                {foundUsers.map((user) => {
                  const userId = user["uid"];
                  return (
                    <List.Item
                      key={userId}
                      title={user.name}
                      style={{
                        paddingLeft: 20,
                      }}
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
                          <Text
                            style={{
                              color: roleColor(user),
                            }}
                          >
                            {userId === currentUserId ? "Me!" : user.role}
                          </Text>
                          <Icon source="chevron-right" />
                        </View>
                      )}
                      onPress={() =>
                        router.push(`content/team/users/${userId}`)
                      }
                    />
                  );
                })}
              </List.Section>
            </KeyboardAwareScrollView>
          </>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </PaperProvider>
  );
}

export default Index;
