import { View } from "react-native";
import { styles } from "../styles/style";
import { Text } from 'react-native-paper';

export default function PlanScreen() {
    return (
        <View style={styles.container}>
            <Text variant="headlineMedium">Plan!</Text>
        </View>
    );
}