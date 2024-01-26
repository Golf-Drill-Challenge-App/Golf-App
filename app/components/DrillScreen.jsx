import { View } from "react-native";
import { styles } from "../styles/style";
import { Text } from 'react-native-paper';

export default function DrillScreen() {
    return (
        <View style={styles.container}>
            <Text variant="headlineMedium">Drill!</Text>
        </View>
    );
}