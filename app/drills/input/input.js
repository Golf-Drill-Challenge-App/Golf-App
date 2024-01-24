import React, { useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaperProvider, Appbar, Text, Button } from "react-native-paper";
import { Link, useNavigation } from "expo-router";
import DrillInput from "./components/drillInput";
import DrillTarget from "./components/drillTarget";
import { DrillData } from "./data/testData";

export default function Input() {
  const [inputValues, setInputValues] = useState(
    Array.from({ length: DrillData.attempts.length }, () => ({}))
  );
  const [attemptIndex, setAttemptIndex] = useState(0);

  const handleInputChange = (id, newText) => {
    setInputValues((prevValues) => {
      const updatedValues = [...prevValues];
      updatedValues[attemptIndex] = {
        ...updatedValues[attemptIndex],
        [id]: newText,
      };
      return updatedValues;
    });
  };

  const navigation = useNavigation();

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <PaperProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Appbar.Header style={{}}>
          <Appbar.BackAction onPress={goBack} color={"#F24E1E"} />
          <Appbar.Content title="20 Shot Challenge" titleStyle={styles.title} />
          <Appbar.Action
            icon="information-outline"
            onPress={() => {}}
            color={"#F24E1E"}
          />
        </Appbar.Header>

        {/* Shot Number / Total shots */}
        <View>
          <Text style={styles.title}>
            Shot {DrillData.attempts[attemptIndex].shotNum}{" "}
            <Text>/{DrillData.attempts.length}</Text>
          </Text>
        </View>

        <View style={styles.container}>
          {/* Instruction */}
          {DrillData.attempts[attemptIndex].target.map((item, id) => (
            <DrillTarget
              key={id}
              description={item.description}
              distanceMeasure={item.distanceMeasure}
              value={item.value}
            />
          ))}

          {/* Inputs */}
          {DrillData.attempts[attemptIndex].inputs.map((item, id) => (
            <DrillInput
              key={id}
              icon={item.icon}
              prompt={item.prompt}
              distanceMeasure={item.distanceMeasure}
              inputValue={inputValues[attemptIndex]?.[item.id] || ""}
              onInputChange={(newText) => {
                handleInputChange(item.id, newText);
              }}
            />
          ))}
        </View>

        {/* Navigation */}

        <View style={styles.container}>
          <Button
            style={styles.button}
            mode="contained-tonal"
            onPress={() => {
              console.log("Pressed Next Shot");
              //this loop is a test to see if inputs are maintained in state
              for (let i = 0; i < DrillData.attempts.length; i++) {
                console.log("InputValue[", i, "]: ", inputValues[i]);
              }
              console.log(inputValues);
            }}
          >
            Next Shot
          </Button>

          <Text onPress={() => console.log("Pressed View All Shots")}>
            View all shots
          </Text>
        </View>

        {/* Test Buttons for navigation between shots */}

        <View style={styles.container}>
          <Button
            style={styles.button}
            mode="contained-tonal"
            onPress={() => {
              setAttemptIndex(attemptIndex + 1);
            }}
          >
            Increase Shot index
          </Button>
          <Button
            style={styles.button}
            mode="contained-tonal"
            onPress={() => {
              setAttemptIndex(attemptIndex - 1);
            }}
          >
            Decrease Shot index
          </Button>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  button: {
    width: 200,
    backgroundColor: "#F24E1E",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  item: {
    marginBottom: 20,
  },
  horizontalContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
