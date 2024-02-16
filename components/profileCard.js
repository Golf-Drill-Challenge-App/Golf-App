import React from 'react';
import {Button, Image, Text} from "react-native";

function ProfileCard(props) {
    return (
        <>
            <Image source={{uri: props.user["pfp"]}} style={{width: 100, height: 100}} />
            <Text>{props.user["name"]}</Text>
            <Button title={"View Stats"}/>
        </>
    );
}

export default ProfileCard;