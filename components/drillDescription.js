import { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";

export default function DrillScreen(props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (index) => {
    setActiveIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const images = [];

  const hasImages = !!images.length;

  const windowWidth = Dimensions.get("window").width;

  return (
    <View style={{ margin: 10 }}>
      <ScrollView style={{ paddingLeft: 5 }}>
        <Text variant="bodyMedium">{props.drillData["description"]}</Text>
        {hasImages && (
          <View style={{ marginTop: 10 }}>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {hasImages &&
                images.map((image, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => openModal(index)}
                  >
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
        )}
      </ScrollView>

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
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Image
              style={{
                width: "100%",
                height: "100%",
              }}
              resizeMode="contain"
              source={images[activeIndex]}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
