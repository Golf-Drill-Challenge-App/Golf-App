import { SectionList, Text } from "react-native";
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
        <>
          <Text style={{ fontSize: 16, fontWeight: "bold", paddingVertical: 5 }}>{title}</Text>
          <Divider bold={true} />
        </>
      )}
    />
  )
}