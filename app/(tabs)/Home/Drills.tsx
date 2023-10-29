import { FlatList, StyleSheet } from "react-native";
import { View } from "../../../components/Themed";
import DrillListItem from "../../../components/DrillListItem";
import SelectorButton from "../../../components/SelectorButton";
import { useAuth } from "../../../context/Auth";
import ScreenHeader from "../../../components/ScreenHeader";

type DrillDisplayInfo = {
  name: string;
  desc: string;
};

const testData: DrillDisplayInfo[] = [
  { name: "Test", desc: "blah blah blah blah blah blah blah" },
  { name: "Test", desc: "blah blah blah blah blah blah blah" },
  { name: "Test", desc: "blah blah blah blah blah blah blah" },
  { name: "Test", desc: "blah blah blah blah blah blah blah" },
  { name: "Test", desc: "blah blah blah blah blah blah blah" },
  { name: "Test", desc: "blah blah blah blah blah blah blah" },
  { name: "Test", desc: "blah blah blah blah blah blah blah" },
  { name: "Test", desc: "blah blah blah blah blah blah blah" },
];

const SelectionOptions = [
  { label: "Assigned", value: "Assigned" },
  { label: "All", value: "All" },
];

export default function Drills() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Drills"
        imageUri={require("../../../assets/images/drillsHeader.jpeg")}
      />
      {user?.type === "coach" && (
        <SelectorButton
          initialValue="Assigned"
          items={SelectionOptions}
          containerStyle={styles.filterDropdown}
        />
      )}
      <FlatList
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        data={testData}
        renderItem={({ item, index }) => (
          <DrillListItem
            href={`/Drills/${index}`}
            name={item.name}
            description={item.desc}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%", // flex: 1 also works, exploring benefits/downsides vs height property
    alignItems: "center",
    justifyContent: "center",
  },
  separator: {
    marginVertical: 8,
    height: 1,
  },
  filterDropdown: {
    width: "30%",
    alignSelf: "flex-start",
    marginStart: 20,
    marginBottom: 15,
  },
  list: {
    width: "90%",
  },
});
