import React from "react";
import teamData from "~/team_data.json";
import { ScrollView, Image, View } from "react-native";
import {
  Text,
  Modal,
  Portal,
  Button,
  PaperProvider,
  List,
  Icon,
  Avatar,
  Searchbar,
} from "react-native-paper";
import { Feather } from "@expo/vector-icons";

function Index() {
  const team = teamData["teams"]["1"];
  const users = team["users"];
  //console.log(users);
  const [visible, setVisible] = React.useState(false);

  const [searchQuery, setSearchQuery] = React.useState("");

  const onChangeSearch = (query) => setSearchQuery(query);

  const foundUsers = Object.values(users).filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // console.log(foundUsers)
  // console.log(searchQuery)

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: "white", padding: 20 };
  return (
    <PaperProvider>
      <Text style={{ fontSize: 30, marginTop: 10, marginLeft: 10 }}>Team</Text>
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
            onPress={showModal}
            size={24}
            style={{ width: 10 }}
            // react native buttons and icons don't play well together: https://stackoverflow.com/a/70038112
            icon={({ size, color }) => (
              <Feather name="settings" size={24} color="black"></Feather>
            )}
          ></Button>
          <Portal>
            <Modal
              visible={visible}
              onDismiss={hideModal}
              contentContainerStyle={containerStyle}
            >
              <Text>Team Settings. Click outside this area to dismiss.</Text>
            </Modal>
          </Portal>
        </View>

        <Text>{Object.keys(users).length} members</Text>
      </View>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={{ marginLeft: 20, marginRight: 20, marginTop: 20 }}
      />
      <ScrollView style={{ marginTop: 20, marginLeft: 20 }}>
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
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text>{user.role}</Text>
                    <Icon source="chevron-right" />
                  </View>
                )}
              />
            );
          })}
        </List.Section>
      </ScrollView>
    </PaperProvider>
  );
}

export default Index;
