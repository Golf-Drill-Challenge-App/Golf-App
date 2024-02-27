import { useState } from "react";
import { Image, View, Pressable, TouchableWithoutFeedback } from "react-native";
import { Button, Text, Portal, Modal } from "react-native-paper";
import { Link } from "expo-router";

export default function Description({ descData, drillId }) {
    const [visible, setVisible] = useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

  return (
    <View style={{ margin: 10 }}>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} style={{ margin: 10 }}>
          <TouchableWithoutFeedback onPress={hideModal}>
            <View style={{ justifyContent: "center", height: "100%", width: "100%" }} >
              <Image
               source={require("~/assets/drill-description-image.jpg")}
               style={{ width: "100%", maxHeight: 200 }}
              />
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </Portal>
      <Text style={{ paddingBottom: 10 }} variant="headlineLarge">
        Description
      </Text>
      <Text variant="bodySmall">{descData.description}</Text>
      <View style={{ marginTop: 10 }}>
        <Pressable onPress={showModal} style={{ backgroundColor: "red", height: 200 }}>
          <Image
           source={require("~/assets/drill-description-image.jpg")}
           style={{ width: "100%", maxHeight: 200 }}
          />
        </Pressable>
      </View>
      <Link
        href={{
          pathname: `/segments/drill/${drillId}/submission`,
        }}
        asChild
      >
        <Button
          style={{ margin: 10 }}
          mode="contained"
          buttonColor="#F24E1E"
          textColor="white"
        >
          Start Drill
        </Button>
      </Link>
    </View>
  );
}
