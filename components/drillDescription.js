import { useState, useEffect } from "react";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
    View,
} from "react-native";
import { List, Text } from "react-native-paper";
import { prettyTitle } from "~/Constants";

export default function DrillDescription({ drillInfo }) {
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
      <ScrollView style={{ paddingLeft: 10 }}>
        <Text style={styles.header}>Description</Text>
        <Text style={styles.bodyText}>{drillInfo["description"]}</Text>
        {drillInfo.inputs && (
          <>
            <Text style={styles.header}>Inputs</Text>
            {drillInfo.inputs.map((input) => (
              <Text key={input.id} style={styles.bodyText}>{`\u2022\t${prettyTitle[input.id]}`}</Text>
            ))}
          </>
        )}
        {drillInfo.outputs && (
          <>
            <Text style={styles.header}>Outputted Data</Text>
            {drillInfo.outputs.map((output) => (
              <Text key={output} style={styles.bodyText}>{`\u2022\t${prettyTitle[output]}`}</Text>
            ))}
          </>
        )}

        {hasImages && (
          <View style={{ marginTop: 10 }}>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {images.map((image, index) => (
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

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 5,
  },
  bodyText: {
    fontSize: 14,
    paddingLeft: 5,
    paddingBottom: 5,
  }
});
