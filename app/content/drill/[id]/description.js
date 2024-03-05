import { Link, useLocalSearchParams } from "expo-router";
import { Dimensions, Image, View } from "react-native";
import Lightbox from "react-native-lightbox-v2";
import { Button, Text } from "react-native-paper";
import Carousel from "react-native-reanimated-carousel";

export default function Description({ descData }) {
  const drillId = useLocalSearchParams()["id"];

  const loadCarousel = (index) => {
    return (
      <Carousel
        width={width - 20}
        height={height}
        data={images}
        defaultIndex={index}
        scrollAnimationDuration={300}
        renderItem={({ index }) => (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Image
              style={{ width: "100%", maxHeight: height, objectFit: "contain" }}
              source={images[index]}
            />
          </View>
        )}
      />
    );
  };

  const width = Dimensions.get("window").width;
  const height = width / 2;

  const images = [
    require("~/assets/drill-description-image.jpg"),
    require("~/assets/adaptive-icon.png"),
    require("~/assets/icon.png"),
    require("~/assets/splash.png"),
    require("~/assets/favicon.png"),
  ];

  return (
    <View style={{ margin: 10 }}>
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
              resizeMode="contain"
              underlayColor="white"
              renderContent={() => loadCarousel(index)}
            >
              <Image
                style={{
                  width: width / 2 - 15,
                  height: width / 2 - 15,
                  marginBottom: 15,
                }}
                source={image}
              />
            </Lightbox>
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
    </View>
  );
}
