import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { themeColors } from "~/Constants";

function DrillCard({ hrefString, leftString, rightString, greyed }) {
  const styles = StyleSheet.create({
    cardContainer: {
      borderWidth: 1,
      borderColor: themeColors.border,
      borderRadius: 8,
      marginVertical: 5,
      padding: 15,
      backgroundColor: greyed ? "#f7f7f7" : "#fff",
    },
    cardContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 16,
      color: greyed ? "#aaa" : "#333",
    },
    specContainer: {
      flex: 1,
      flexDirection: "column",
      alignItems: "flex-end",
    },
    inputText: {
      fontSize: 14,
      color: greyed ? "#aaa" : "#666",
    },
  });

  return (
    <Link href={hrefString} asChild>
      <TouchableOpacity style={styles.cardContainer}>
        <View style={styles.cardContent}>
          <Text style={styles.title}>{leftString}</Text>
          <View style={styles.specContainer}>
            <Text style={styles.inputText}>{rightString}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

export default DrillCard;
