import { SectionList, Text, View } from "react-native";
import { Divider } from "react-native-paper";

import { themeColors } from "~/Constants";
import DrillCard from "~/components/drillCard";
import RefreshInvalidate from "~/components/refreshInvalidate";

export default function DrillList({
  drillData,
  href,
  invalidateKeys,
  children,
}) {
  const drills = [];
  Object.values(drillData).forEach((drill) => {
    if (drills.length !== 0) {
      const idx = drills.findIndex((item) => item.title === drill.drillType);
      if (idx !== -1) {
        drills[idx].data.push(drill);
      } else {
        drills.push({
          title: drill.drillType,
          data: [drill],
        });
      }
    } else {
      drills.push({
        title: drill.drillType,
        data: [drill],
      });
    }
  });

  drills.sort((a, b) => {
    const titleA = a.title;
    const titleB = b.title;
    if (titleA < titleB) {
      return -1;
    }
    if (titleA > titleB) {
      return 1;
    }
    return 0;
  });

  drills.forEach((section) => {
    section.data.sort((a, b) => {
      const subTypeA = a.subType;
      const subTypeB = b.subType;
      if (subTypeA < subTypeB) {
        return -1;
      }
      if (subTypeA > subTypeB) {
        return 1;
      }
      return 0;
    });
  });

  return (
    <SectionList
      style={{ paddingHorizontal: 20, height: "100%" }}
      sections={drills}
      ListHeaderComponent={children}
      renderItem={({ item }) => (
        <DrillCard key={item.did} drill={item} hrefString={href + item.did} />
      )}
      renderSectionHeader={({ section: { title } }) => (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            paddingVertical: 5,
            alignItems: "center",
            backgroundColor: themeColors.background,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{title}</Text>
          <Divider bold={true} />
        </View>
      )}
      refreshControl={<RefreshInvalidate invalidateKeys={invalidateKeys} />}
    />
  );
}
