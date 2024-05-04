import { StyleSheet, Text, View } from "react-native";
import { Image } from "react-native-expo-image-cache";

function ProfileCard(props) {
  return (
    <View style={styles.container}>
      <Image style={styles.profileImage} uri={props.user["pfp"]} />
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
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "gray",
  },
});

export default ProfileCard;
