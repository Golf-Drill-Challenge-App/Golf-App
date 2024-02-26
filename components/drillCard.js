import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

function DrillCard(props) {
  return (
    <Link href={props.hrefString} asChild>
      <TouchableOpacity style={styles.cardContainer}>
        <View style={styles.cardContent}>
          <Text style={styles.drillType}>{props.drill["drillType"]}</Text>
          <View style={styles.specContainer}>
            <Text style={styles.specText}>{props.drill["spec"]}</Text>
            <Text style={styles.inputText}>
              {props.drill["inputs"]
                .map((input) => {
                  let retVal = "";
                  switch (input) {
                    case "distance":
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
                })
                .join(" ") +
                " x" +
                props.drill["reps"]}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginVertical: 5,
    padding: 10,
    backgroundColor: "#fff",
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  drillType: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  specContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-end",
  },
  specText: {
    fontSize: 14,
    color: "#666",
  },
  inputText: {
    fontSize: 14,
    color: "#666",
  },
});

export default DrillCard;
