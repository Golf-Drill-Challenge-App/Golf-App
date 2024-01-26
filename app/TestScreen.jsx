import { View } from "react-native";
import { styles } from "./styles/style";
import { Text } from 'react-native-paper';
import { Link } from 'expo-router';

export default function TestScreen() {
    return (
        <View style={styles.container}>
            <Text variant="headlineMedium">Test</Text>
        </View>
    );
}