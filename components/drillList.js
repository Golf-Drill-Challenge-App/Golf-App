import { SectionList, Text, View } from "react-native";
import { Divider } from "react-native-paper";

import DrillCard from "~/components/drillCard";
import RefreshInvalidate from "~/components/refreshInvalidate";

export default function DrillList({ drillData, href, children }) {
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

  function getDrillIndexByTitle(title) {
    return drillData.findIndex((item) => item.drillType === title);
  }

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
            backgroundColor: "#F2F2F2",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>{title}</Text>
          <Text style={{ color: "#666", paddingHorizontal: 5 }}>
            {drillData[getDrillIndexByTitle(title)].inputs.map((input) => {
              let retVal = "";
              switch (input.id) {
                case "carry":
                  retVal = "↑";
                  break;
                case "sideLanding":
                  retVal = "↔︎";
                  break;
                case "strokes":
                  retVal = "#";
                  break;
                default:
                  retVal = "?";
              }
              return retVal;
            })}
          </Text>
          <Divider bold={true} />
        </View>
      )}
      refreshControl={<RefreshInvalidate invalidateKeys={invalidateKeys} />}
    />
  );
}
