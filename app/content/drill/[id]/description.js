import { useState } from "react";
import { Image, View, Pressable, TouchableWithoutFeedback, Dimensions } from "react-native";
import Carousel from 'react-native-reanimated-carousel';
import { Button, Text, Portal, Modal } from "react-native-paper";
import { Link, useLocalSearchParams } from "expo-router";

export default function Description({ descData }) {
    const drillId = useLocalSearchParams()["id"];
    const [visible, setVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const handleCarouselChange = (index) => {
        setActiveIndex(index);
    };

    const width = Dimensions.get('window').width;
    const height = width / 2;

    const images = [
        require('~/assets/drill-description-image.jpg'),
        require('~/assets/adaptive-icon.png'),
        require('~/assets/icon.png'),
        require('~/assets/splash.png'),
        require('~/assets/favicon.png'),
    ];

  return (
    <View style={{ margin: 10 }}>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} style={{ margin: 10 }}>
          <TouchableWithoutFeedback onPress={hideModal}>
            <View style={{ justifyContent: "center", height: "100%", width: "100%" }}>
              <Image
                source={images[activeIndex]}
                style={{ width: "100%", objectFit: "contain" }}
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
        <Carousel
          width={width - 20}
          height={height}
          data={images}
          onSnapToItem={handleCarouselChange}
          scrollAnimationDuration={300}
          renderItem={({ index }) => (
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Pressable onPress={showModal} style={{ justifyContent: 'center' }}>
                <Image style={{ width: "100%", maxHeight: height, objectFit: "contain" }} source={images[index]} />
              </Pressable>
            </View>
          )}
        />
        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
          {images.map((_, index) => (
            <View
              key={index}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: index === activeIndex ? "blue" : "gray",
                marginHorizontal: 4,
              }}
            />
          ))}
        </View>
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
    </ScrollView>
  );
}