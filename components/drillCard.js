import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { themeColors } from "~/Constants";

function DrillCard(props) {
  return (
    <Link href={props.hrefString} asChild>
      <TouchableOpacity style={styles.cardContainer}>
        <View style={styles.cardContent}>
          <Text style={styles.title}>{props.drill.subType}</Text>
          <View style={styles.specContainer}>
            <Text style={styles.inputText}>{"x" + props.drill["reps"]}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 1,
    borderColor: themeColors.border,
    borderRadius: 8,
    marginVertical: 5,
    padding: 15,
    backgroundColor: themeColors.highlight,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    color: "#333",
  },
  specContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-end",
  },
  inputText: {
    fontSize: 14,
    color: "#666",
  },
});

export default DrillCard;
