import { router } from "expo-router";
import { useState } from "react";
import { Image, Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Avatar, Icon, List, Searchbar, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "~/Constants";
import ErrorComponent from "~/components/errorComponent";
import Header from "~/components/header";
import Loading from "~/components/loading";
import PaperWrapper from "~/components/paperWrapper";
import RefreshInvalidate from "~/components/refreshInvalidate";
import { currentAuthContext } from "~/context/Auth";
import { useUserInfo } from "~/hooks/useUserInfo";

function Index() {
  const { currentUserId } = currentAuthContext();
  const {
    data: userInfo,
    isLoading: userInfoIsLoading,
    error: userInfoError,
  } = useUserInfo();
  const invalidateKeys = [["userInfo"]];
  const [searchQuery, setSearchQuery] = useState("");

  const onChangeSearch = (query) => setSearchQuery(query);

  if (userInfoIsLoading) return <Loading />;

  if (userInfoError) return <ErrorComponent errorList={[userInfoError]} />;
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
      ? themeColors.accent
      : user.role === "owner"
        ? "#3366ff"
        : "#222";

  return (
    <PaperWrapper>
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
            <Header title={"Team"} />
            <KeyboardAwareScrollView
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
                    backgroundColor: themeColors.highlight,
                    borderWidth: 1,
                    borderColor: themeColors.border,
                  }}
                  placeholder="Search team members"
                />
              </View>

              <List.Section style={{ backgroundColor: themeColors.background }}>
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
    </PaperWrapper>
  );
}

export default Index;
