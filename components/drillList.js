import { SectionList, Text, View } from "react-native";
import { Divider } from "react-native-paper";

import DrillCard from "~/components/drillCard"

export default function DrillList(props) {
  const drills = [];
  Object.values(props.drillData).forEach(drill => {
    if (drills.length !== 0) {
      const idx = drills.findIndex(item => item.title === drill.prettyDrillType)
      if (idx !== -1) {
        drills[idx].data.push(drill)
      }
      else {
        drills.push({
          title: drill.prettyDrillType,
          data: [
            drill,
          ],
        })
      }
    }
    else {
      drills.push({
        title: drill.prettyDrillType,
        data: [
          drill,
        ],
      })
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
    return props.drillData.findIndex(item => item.prettyDrillType === title);
  }

  return (
    <SectionList
      style={{ paddingHorizontal: 20, paddingBottom: 50 }}
      sections={drills}
      renderItem={({item}) => (
        <DrillCard
          key={item.did}
          drill={item}
          hrefString={props.href + item.did}
        />
      )}
      renderSectionHeader={({section: {title}}) => (
        <View style={{ flex: 1, flexDirection: "row", paddingVertical: 5 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>{title}</Text>
          <Text style={{ color: "#666", paddingHorizontal: 5 }}>
            {props.drillData[getDrillIndexByTitle(title)].inputs
              .map((input) => {
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
    />
  )
}