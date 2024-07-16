import { useNavigation } from "expo-router";
import { useMemo, useState } from "react";
import { Appbar, SegmentedButtons } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "~/Constants";
import Blacklist from "~/app/segments/(team)/blacklist";
import Header from "~/components/header";

function ManageForeignRequests() {
  const [tabValue, setTabValue] = useState("invites");
  const navigation = useNavigation();

  const segmentedColor = (tab) => {
    switch (tab) {
      case "invites":
        return "#008001";
      case "waitlist":
        return "#FFE900";
      case "blacklist":
        return "#FE0100";
      default:
        return themeColors.overlay;
    }
  };

  const segmentedTextColor = (tab) => {
    switch (tab) {
      case "invites":
      case "blacklist":
        return "white";
      case "waitlist":
        return "black";
      default:
        return "black";
    }
  };

  const tabComponent = useMemo(
    () => ({
      invites: <></>,
      waitlist: <></>,
      blacklist: <Blacklist />,
    }),
    [],
  ); // Recreate pages only if drillId changes

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <Header
        title="Manage Foreign Requests"
        preChildren={
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack();
            }}
            color={themeColors.accent}
          />
        }
      />
      <SegmentedButtons
        value={tabValue}
        onValueChange={setTabValue}
        style={{
          marginLeft: 10,
          marginRight: 10,
          backgroundColor: themeColors.highlight,
          borderRadius: 20,
        }}
        theme={{
          colors: {
            secondaryContainer: segmentedColor(tabValue),
            onSecondaryContainer: segmentedTextColor(tabValue),
          },
        }}
        buttons={[
          {
            value: "invites",
            label: "Invites",
          },
          {
            value: "waitlist",
            label: "Waitlist",
          },
          {
            value: "blacklist",
            label: "Blacklist",
          },
        ]}
      />
      {tabComponent[tabValue]}
    </SafeAreaView>
  );
}

export default ManageForeignRequests;
