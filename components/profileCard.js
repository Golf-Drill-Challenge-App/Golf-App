import { StyleSheet, Text, View } from "react-native";
import ProfilePicture from "~/components/ProfilePicture";

function ProfileCard(props) {
  const profilePicSize = 150;

  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
    },
    profileImage: {
      width: profilePicSize,
      height: profilePicSize,
      borderRadius: profilePicSize / 2, // to make it a circle
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

  return (
    <View style={styles.container}>
      <ProfilePicture userInfo={props.user} style={styles.profileImage} />
      <Text style={styles.name}>{props.user["name"]}</Text>
      <Text style={styles.email}>{props.email}</Text>
    </View>
  );
}

export default ProfileCard;
