import { StyleSheet, Text, View } from "react-native";
import { Image } from "react-native-expo-image-cache";

function prettyRole(role) {
  switch (role) {
    case "coach":
      return "Coach";

    case "owner":
      return "Owner";

    case "player":
      return "Player";

    default:
      break;
  }
}

function ProfileCard(props) {
  return (
    <View style={styles.container}>
      <Image style={styles.profileImage} uri={props.user["pfp"]} />
      <Text style={styles.role}>{prettyRole(props.user["role"])}</Text>
      <Text style={styles.name}>{props.user["name"]}</Text>
      <Text style={styles.email}>{props.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75, // to make it a circle
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    color: "#333",
    fontWeight: "bold",
  },
  role: {
    fontSize: 16,
    color: "#666",
  },
  email: {
    fontSize: 16,
    color: "#999",
  },
});

export default ProfileCard;
