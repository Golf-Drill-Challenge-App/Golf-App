import React from 'react'
import { View, SafeAreaView  } from 'react-native'
import { List, Text, Icon, Avatar} from 'react-native-paper'
import { Link } from 'expo-router'

export default function Leaderboard() {
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Link href={{
                    pathname: "/"
                }}>
                    Go back to Index
                </Link>
        <List.Section>
            <List.Item
                title="Frank Nguyen"
                left={() => <Avatar.Text size={24} label="XD" />}
                right={() => (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text>8 ft</Text>
                        <Icon source="chevron-right" />
                    </View>
                )}
            />
            <List.Item
                title="Frank Nguyen"
                left={() => <Avatar.Text size={24} label="XD" />}
                right={() => (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text>8 ft</Text>
                        <Icon source="chevron-right" />
                    </View>
                )}
            />
        </List.Section >
        </SafeAreaView>
    )
}