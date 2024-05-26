import { StyleSheet, Text, View } from "react-native";
import { Image } from "react-native-expo-image-cache";
import { Avatar } from "react-native-paper";
import { themeColors } from "~/Constants";
import { getInitials } from "~/Utility";

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
      {props.user.pfp ? (
        <Image uri={props.user.pfp} style={styles.profileImage} />
      ) : (
        <Avatar.Text
          size={profilePicSize}
          label={getInitials(props.user.name)}
          color="white"
          style={{ backgroundColor: themeColors.avatar }}
        />
      )}
      <Text style={styles.name}>{props.user["name"]}</Text>
      <Text style={styles.email}>{props.email}</Text>
    </View>
  );
}

export default ProfileCard;
