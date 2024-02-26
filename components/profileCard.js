import React from "react";
import { Image, Text, View, StyleSheet } from "react-native";

function ProfileCard(props) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: props.user["pfp"] }} style={styles.profileImage} />
      <Text style={styles.name}>{props.user["name"]}</Text>
      <Text style={styles.email}>
        {/* TODO!!! props.user["email"] */ "emailproperty@gmail.com"}
      </Text>
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
