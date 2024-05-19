import { useLocalSearchParams, useNavigation } from "expo-router";
import { useContext } from "react";
import { ScrollView, View } from "react-native";
import { Image } from "react-native-expo-image-cache";
import { Appbar, List, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "~/Constants";
import { PlayerContext } from "~/app/content/assignments/context";
import AssignmentCard from "~/components/assignmentCard";
import ErrorComponent from "~/components/errorComponent";
import Header from "~/components/header";
import Loading from "~/components/loading";
import PaperWrapper from "~/components/paperWrapper";
import RefreshInvalidate from "~/components/refreshInvalidate";
import { useDrillInfo } from "~/hooks/useDrillInfo";

function Index() {
  const navigation = useNavigation();
  const { drillId } = useLocalSearchParams();
  const {
    data: drillInfo,
    isLoading: drillInfoIsLoading,
    error: drillInfoError,
  } = useDrillInfo({ drillId });
  const { playerList } = useContext(PlayerContext);
  const invalidateKeys = [["userInfo"]];

  if (drillInfoIsLoading) return <Loading />;

  if (drillInfoError) return <ErrorComponent errorList={[drillInfoError]} />;

  const numCompleted = playerList.filter(
    (assignment) => assignment.completed,
  ).length;

  return (
    <PaperWrapper>
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
        <ScrollView
          refreshControl={<RefreshInvalidate invalidateKeys={invalidateKeys} />}
        >
          <Text style={{ textAlign: "center" }}>
            {numCompleted} / {playerList.length} completed
          </Text>
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
                  <AssignmentCard
                    mainText={assignment.userName}
                    completed={assignment.completed}
                    pfp={
                      <Image
                        uri={assignment.pfp}
                        style={{
                          height: 24,
                          width: 24,
                          borderRadius: 12,
                          marginRight: 10,
                        }}
                      />
                    }
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
