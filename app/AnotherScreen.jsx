import { View } from "react-native";
import { styles } from "./styles/style";
import { Text } from 'react-native-paper';
import { Link } from 'expo-router';

export default function AnotherScreen() {
    return (
        <View style={styles.container}>
            <Text variant="headlineMedium">Another Screen</Text>
        </View>
    );
}