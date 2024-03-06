import { Link, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Dimensions, Image, ScrollView, View } from "react-native";
import Lightbox from "react-native-lightbox-v2";
import { Button, Text } from "react-native-paper";
import Carousel from "react-native-reanimated-carousel";

export default function Description({ descData }) {
  const drillId = useLocalSearchParams()["id"];

  const [activeIndex, setActiveIndex] = useState(0);

  const loadCarousel = (index) => {
    return (
      <Carousel
        width={windowWidth}
        height={height}
        data={images}
        defaultIndex={index}
        scrollAnimationDuration={300}
        onSnapToItem={() => setActiveIndex(index)}
        renderItem={({ index }) => (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Image
              style={{
                width: "100%",
                maxHeight: height,
                objectFit: "contain",
              }}
              source={images[index]}
            />
          </View>
        )}
      />
    );
  };

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const height = windowWidth / 2;

  const images = [
    require("~/assets/drill-description-image.jpg"),
    require("~/assets/adaptive-icon.png"),
    require("~/assets/icon.png"),
    require("~/assets/splash.png"),
    require("~/assets/favicon.png"),
  ];

  return (
    <View
      style={{ margin: 10, position: "relative", height: windowHeight - 150 }}
    >
      <ScrollView>
        <Text style={{ paddingBottom: 10 }} variant="headlineLarge">
          Description
        </Text>
        <Text variant="bodySmall">{descData.description}</Text>
        <View style={{ marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {images.map((image, index) => (
              <Lightbox
                key={index}
                underlayColor="white"
                onOpen={() => setActiveIndex(index)}
                renderContent={() => loadCarousel(index)}
              >
                <Image
                  style={{
                    width: windowWidth / 3 - 10,
                    height: windowWidth / 3 - 10,
                    marginBottom: 15,
                  }}
                  source={image}
                />
              </Lightbox>
            ))}
          </View>
        </View>
      </ScrollView>
      <Link
        href={{
          pathname: `/segments/drill/${drillId}/submission`,
        }}
        asChild
      >
        <Button
          style={{
            margin: 10,
            position: "absolute",
            bottom: 10,
            left: 0,
            right: 0,
          }}
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
