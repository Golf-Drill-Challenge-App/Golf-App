import { StyleSheet, Text, View } from "react-native";
import ProfilePicture from "~/components/ProfilePicture";
import { prettyRole } from "../Constants";

function ProfileCard(props) {
  const profilePicSize = 150;

  const roleColor = props.user["role"] === "owner" ? "#3366ff" : "#222";

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
    role: {
      fontSize: 16,
    },
    email: {
      fontSize: 16,
      color: "gray",
    },
  });

  return (
    <View style={styles.container}>
      <ProfilePicture userInfo={props.user} style={styles.profileImage} />
      <Text style={[styles.role, { color: roleColor }]}>
        {prettyRole[props.user["role"]]}
      </Text>
      <Text style={styles.name}>{props.user["name"]}</Text>
      <Text style={styles.email}>{props.email}</Text>
    </View>
  );
}

export default ProfileCard;
