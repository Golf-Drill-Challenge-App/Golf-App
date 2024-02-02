import { View, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Appbar, Text, Button } from 'react-native-paper'
import { Link, useNavigation } from 'expo-router'

export default function Input() {
    const navigation = useNavigation()

    const goBack = () => {
        navigation.goBack()
    }

    return (
        <PaperProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <Appbar.Header style={{}}>
                    <Appbar.BackAction onPress={goBack} color={"#F24E1E"} />
                    <Appbar.Content title="20 Shot Challenge" />
                </Appbar.Header>
            </SafeAreaView>
        </PaperProvider>
    )
}