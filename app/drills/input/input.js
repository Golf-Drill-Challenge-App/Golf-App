import React, { useState, useCallback, useMemo, useRef } from "react";
import { View, Image, StyleSheet, ScrollView, Pressable } from "react-native";
import { PaperProvider, Appbar, Text, Button } from "react-native-paper";
import { Link, useNavigation } from "expo-router";
import DrillInput from "./components/drillInput";
import DrillTarget from "./components/drillTarget";
import { DrillData } from "./data/testData";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Description from "../description";
import NavigationRectange from "./components/navigationRectange";

export default function Input() {
  const [inputValues, setInputValues] = useState(
    Array.from({ length: DrillData.attempts.length }, () => ({}))
  ); //a useState hook to track the inputs on each shot
  const [shotIndex, setShotIndex] = useState(0); //a useState hook to track what shot index

  const [currentShot, setCurrentShot] = useState(0); //a useState hook to track current shot

  //Changes the button depending on the current shot and shot index
  const buttonDisplayHandler = () => {
    //Logic to display "Submit Drill"
    if (
      currentShot == DrillData.attempts.length - 1 &&
      shotIndex == DrillData.attempts.length - 1
    ) {
      return (
        <Button
          style={styles.button}
          mode="contained-tonal"
          onPress={() => {
            console.log("Pressed Submit Drill");
          }}
        >
          Submit Drill
        </Button>
      );
    }

    //Logic to dislay "Next Shot"
    if (shotIndex == currentShot) {
      return (
        <Button
          style={styles.button}
          mode="contained-tonal"
          onPress={() => {
            console.log("Pressed Next Shot");
            setShotIndex(shotIndex + 1);
            setCurrentShot(currentShot + 1);
          }}
        >
          Next Shot
        </Button>
      );
    } else {
      return (
        <Button
          style={styles.disabledButton}
          dark={true}
          mode="contained-tonal"
          onPress={() => {
            console.log("Pressed Back to Latest");
            setShotIndex(currentShot);
          }}
        >
          Back to Latest
        </Button>
      );
    }
  };

  //Function to help in maintaing State of inputs
  const handleInputChange = (id, newText) => {
    setInputValues((prevValues) => {
      const updatedValues = [...prevValues];
      updatedValues[shotIndex] = {
        ...updatedValues[shotIndex],
        [id]: newText,
      };
      return updatedValues;
    });
  };

  const navigation = useNavigation();

  const goBack = () => {
    navigation.goBack();
  };

  //Bottom Sheet stuff
  const navigationBottomSheetModalRef = useRef(null);

  const snapPoints = useMemo(() => ["50%", "90%"], []);

  // callbacks
  const handlePresentNavigationModalPress = useCallback(() => {
    navigationBottomSheetModalRef.current?.present();
  }, []);
  const handleNavigationSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  //Description Bottom Sheet Stuff

  const descriptionBottomSheetModalRef = useRef(null);

  // callbacks
  const handlePresentDesciptionModalPress = useCallback(() => {
    descriptionBottomSheetModalRef.current?.present();
  }, []);
  const handleDesciptionSheetChanges = useCallback((index) => {
    console.log("handleDesciptionSheetChanges", index);
  }, []);

  //test for navigation on sheet

  const testIndexs = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <BottomSheetModalProvider>
          <View>
            <Appbar.Header style={{}} statusBarHeight={0}>
              <Appbar.BackAction onPress={goBack} color={"#F24E1E"} />
              <Appbar.Content
                title="20 Shot Challenge"
                titleStyle={styles.title}
              />
              <Appbar.Action
                icon="information-outline"
                onPress={() => {
                  handlePresentDesciptionModalPress();
                }}
                color={"#F24E1E"}
              />
            </Appbar.Header>

            {/* Shot Number / Total shots */}
            <View>
              <Text style={styles.title}>
                Shot {DrillData.attempts[shotIndex].shotNum}{" "}
                <Text>/{DrillData.attempts.length}</Text>
              </Text>
            </View>
            <KeyboardAwareScrollView>
              <View style={styles.container} marginBottom={100}>
                {/* Instruction */}

                <View style={styles.horizontalContainer}>
                  {DrillData.attempts[shotIndex].target.map((item, id) => (
                    <DrillTarget
                      key={id}
                      description={item.description}
                      distanceMeasure={item.distanceMeasure}
                      value={item.value}
                    />
                  ))}
                </View>

                {/* Inputs */}

                {DrillData.attempts[shotIndex].inputs.map((item, id) => (
                  <DrillInput
                    key={id}
                    icon={item.icon}
                    prompt={item.prompt}
                    distanceMeasure={item.distanceMeasure}
                    inputValue={inputValues[shotIndex]?.[item.id] || ""}
                    onInputChange={(newText) => {
                      handleInputChange(item.id, newText);
                    }}
                  />
                ))}
              </View>

              {/* Navigation */}

              <View style={styles.container}>
                {buttonDisplayHandler()}

                <Text
                  onPress={() => {
                    console.log("Pressed View All Shots");
                    handlePresentNavigationModalPress();
                  }}
                >
                  View all shots
                </Text>
              </View>

              {/* Test Buttons for navigation between shots and state status */}

              <View style={styles.container} marginTop={20}>
                <Button
                  style={styles.button}
                  mode="contained-tonal"
                  onPress={() => {
                    //this loop is a test to see if inputs are maintained in state
                    for (let i = 0; i < DrillData.attempts.length; i++) {
                      console.log("InputValue[", i, "]: ", inputValues[i]);
                    }
                    console.log(inputValues);
                  }}
                >
                  Log Input State Status
                </Button>
              </View>
            </KeyboardAwareScrollView>
            {/*Navigation Bottom Sheet */}
            <BottomSheetModal
              ref={navigationBottomSheetModalRef}
              index={1}
              snapPoints={snapPoints}
              onChange={handleNavigationSheetChanges}
            >
              <BottomSheetScrollView>
                <View style={styles.bottomSheetContentContainer}>
                  {DrillData.attempts.map((item, id) => (
                    <Pressable
                      onPress={() => {
                        console.log("Clicked on ", id);
                        console.log(item);
                        console.log(inputValues[id]);
                        console.log(item.target);
                        console.log(item.inputs);
                        setShotIndex(id);
                        navigationBottomSheetModalRef.current.close();
                      }}
                      width={"100%"}
                      alignItems={"center"}
                    >
                      <NavigationRectange
                        id={id}
                        onPress={() => {
                          console.log("Clicked on ", id);
                          setShotIndex(id);
                        }}
                        inputs={item.inputs}
                        target={item.target}
                        inputValues={inputValues[id]}
                        shotIndex={item.shotNum}
                        numShots={DrillData.attempts.length}
                      />
                    </Pressable>
                  ))}
                </View>
              </BottomSheetScrollView>
            </BottomSheetModal>

            {/* Description Bottom Sheet */}
            <BottomSheetModal
              ref={descriptionBottomSheetModalRef}
              index={1}
              snapPoints={snapPoints}
              onChange={handleDesciptionSheetChanges}
            >
              <BottomSheetScrollView>
                <Description />
              </BottomSheetScrollView>
            </BottomSheetModal>
          </View>
        </BottomSheetModalProvider>
      </PaperProvider>
    </GestureHandlerRootView>
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
  disabledButton: {
    width: 200,
    backgroundColor: "#A0A0A0",
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
    marginVertical: 10,
  },
  bottomSheetContentContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingVertical: 20,
  },
});
