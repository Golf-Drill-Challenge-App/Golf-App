import { Link, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Text } from "react-native-paper";
import Carousel from "react-native-reanimated-carousel";

import Loading from "~/components/loading";
import ErrorComponent from "../../../../components/errorComponent";
import { useDrillInfo } from "../../../../hooks/useDrillInfo";

export default function Description() {
  const drillId = useLocalSearchParams()["id"];

  const [activeIndex, setActiveIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (index) => {
    setActiveIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const loadCarousel = () => {
    return (
      <Carousel
        width={windowWidth}
        height={windowHeight}
        data={images}
        defaultIndex={activeIndex}
        scrollAnimationDuration={300}
        renderItem={({ item }) => (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Image
              style={{
                width: "100%",
                height: "100%",
              }}
              resizeMode="contain"
              source={item}
            />
          </View>
        )}
      />
    );
  };

  const images = [
    require("~/assets/drill-description-image.jpg"),
    require("~/assets/adaptive-icon.png"),
    require("~/assets/icon.png"),
    require("~/assets/splash.png"),
    require("~/assets/favicon.png"),
  ];

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const {
    data: drillInfo,
    error: drillInfoError,
    isLoading: drillInfoIsLoading,
  } = useDrillInfo(drillId);

  if (drillInfoIsLoading) return <Loading />;

  if (drillInfoError) return <ErrorComponent error={error.message} />;


  return (
    <View
      style={{ margin: 10, position: "relative", height: windowHeight - 150 }}
    >
      <ScrollView>
        <Text style={{ paddingBottom: 10 }} variant="headlineLarge">
          Description
        </Text>
        <Text variant="bodySmall">{drillInfo["description"]}</Text>
        <View style={{ marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {images.map((image, index) => (
              <TouchableOpacity key={index} onPress={() => openModal(index)}>
                <Image
                  style={{
                    width: windowWidth / 3 - 10,
                    height: windowWidth / 3 - 10,
                    marginBottom: 15,
                  }}
                  source={image}
                />
              </TouchableOpacity>
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

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "black",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={{
              padding: 20,
              position: "absolute",
              top: 20,
              left: 20,
              zIndex: 10,
            }}
            onPress={closeModal}
          >
            <Text style={{ color: "white", fontSize: 18 }}>Close</Text>
          </TouchableOpacity>
          {loadCarousel()}
        </View>
      </Modal>
    </View>
  );
}
