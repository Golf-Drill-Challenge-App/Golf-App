import React from 'react'
import { View } from 'react-native'
import { List, Text, Icon, Avatar } from 'react-native-paper'

export default function Leaderboard() {
    return (
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
    )
}