import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import {
  Appbar,
  Banner,
  Button,
  Dialog,
  PaperProvider,
  Portal,
  Text,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import DrillInput from "~/components/input/drillInput";
import DrillTarget from "~/components/input/drillTarget";
import NavigationRectange from "~/components/input/navigationRectange";

import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AttemptData } from "~/testData";
import Description from "./modals/description";
import { lookUpExpectedPutts, lookUpBaselineStrokesGained } from "~/Utility";

const { id } = useLocalSearchParams();

const did = id;

const outputs = [
  "target",
  "carry",
  "sideLanding",
  "proxHole",
  "baseline",
  "expectedPutts",
  "strokesGained",
  "carryDiff",
];

function calculateProxHole(target, carry, sideLanding) {
  let carryDiff = calculateCarryDiff(target, carry);
  return Math.sqrt(Math.pow(carryDiff * 3, 2) + Math.pow(sideLanding, 2));
}

function calculateCarryDiff(target, carry) {
  return Math.abs(carry - target);
}

function createOutputData(inputValues, attemptData) {
  //initialize total values
  let strokesGainedTotal = 0;
  let proxHoleTotal = 0;
  let sideLandingTotal = 0;
  let carryDiffTotal = 0;

  let outputShotData = [];

  //Generate the shots array for output data
  for (let j = 0; j < inputValues.length; j++) {
    //Generate the shots array for output data
    let shot = {};
    for (let i = 0; i < outputs.length; i++) {
      const output = outputs[i];

      switch (output) {
        case "target":
          shot.target = attemptData.shots[j].value;
          break;

        case "carry":
          shot.carry = inputValues[j].carry;
          break;

        case "sideLanding":
          shot.sideLanding = inputValues[j].sideLanding;
          sideLandingTotal += shot.sideLanding;
          break;

        case "proxHole":
          shot.proxHole = calculateProxHole(
            attemptData.shots[j].value,
            inputValues[j].carry,
            inputValues[j].sideLanding,
          );
          proxHoleTotal += shot.proxHole;
          break;

        case "baseline":
          shot.baseline = attemptData.shots[j].baseline;
          break;

        case "expectedPutts":
          shot.expectedPutts = lookUpExpectedPutts(
            calculateProxHole(
              attemptData.shots[j].value,
              inputValues[j].carry,
              inputValues[j].sideLanding,
            ),
          );
          break;

        case "strokesGained":
          shot.strokesGained =
            attemptData.shots[j].baseline - shot.expectedPutts - 1;
          strokesGainedTotal += shot.strokesGained;
          break;

        case "carryDiff":
          shot.carryDiff = calculateCarryDiff(
            attemptData.shots[j].value,
            inputValues[j].carry,
          );
          carryDiffTotal += shot.carryDiff;
          break;

        default:
          console.log("Output Calculation not found\n");
          break;
      }
    }

    //add the sid to the shot
    shot.sid = j;

    //push the shot into the array
    outputShotData.push(shot);
  }

  //get the time stamp
  const timeStamp = Date.now();

  //get the average strokes gained
  const avgStrokesGained = strokesGainedTotal / inputValues.length;

  //get the average carry Diff
  const avgCarryDiff = carryDiffTotal / inputValues.length;

  // get the average prox hole

  const avgProxHole = proxHoleTotal / inputValues.length;

  // get the average side landing
  const avgSideLanding = sideLandingTotal / inputValues.length;

  //get uid
  //TODO: figure out how to get this information
  const uid = "c0nEyjaOMhItMQTLMY0X"; //temporary until we can get this from params

  //create the outputData object
  const outputData = {
    time: timeStamp,
    did: did,
    shots: outputShotData,
    carryDiffAverage: avgCarryDiff,
    proxHoleAverage: avgProxHole,
    sideLandingAverage: avgSideLanding,
    strokesGainedAverage: avgStrokesGained,
    strokesGained: strokesGainedTotal,
    uid: uid,
  };

  return {
    outputData,
  };
}

export default function Input({ attemptData, setToggleResult, setOutputData }) {
  //Helper varibles
  const numInputs = attemptData.inputs.length;

  //a useState hook to track the inputs on each shot
  const [inputValues, setInputValues] = useState(
    Array.from({ length: attemptData.shots.length }, () => ({})),
  );

  const [shotIndex, setShotIndex] = useState(0); //a useState hook to track what shot index

  const [currentShot, setCurrentShot] = useState(0); //a useState hook to track current shot

  const { id } = useLocalSearchParams();

  //Changes the button depending on the current shot and shot index
  const buttonDisplayHandler = () => {
    //Logic to display "Submit Drill"
    if (
      // currentShot == AttemptData.shots.length - 1 &&
      // shotIndex == AttemptData.shots.length - 1
      1
    ) {
      return (
        <Button
          style={styles.button}
          labelStyle={styles.buttonText}
          mode="contained-tonal"
          onPress={() => {
            setOutputData(createOutputData(inputValues, attemptData));
            //send the output data to the database here
            setToggleResult(true);
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
          labelStyle={styles.buttonText}
          mode="contained-tonal"
          onPress={() => {
            console.log("Pressed Next Shot");
            handleNextShotButtonClick();
          }}
        >
          Next Shot
        </Button>
      );
    } else {
      return (
        <Button
          style={styles.disabledButton}
          labelStyle={styles.buttonText}
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

  //Function to handle "Next shot" button click
  const handleNextShotButtonClick = () => {
    //Check if all inputs have been filled in
    if (Object.keys(inputValues[shotIndex]).length === numInputs) {
      setEmptyInputBannerVisable(false);
      setShotIndex(shotIndex + 1);
      setCurrentShot(currentShot + 1);
    } else {
      console.log("Not all input fields entered!");
      setEmptyInputBannerVisable(true);
    }
  };

  const navigation = useNavigation();

  const goBack = () => {
    navigation.goBack();
  };

  /***** Navigation Bottom Sheet stuff *****/
  const navigationBottomSheetModalRef = useRef(null);

  const snapPoints = useMemo(() => ["50%", "90%"], []);

  // callbacks
  const handlePresentNavigationModalPress = useCallback(() => {
    navigationBottomSheetModalRef.current?.present();
  }, []);
  const handleNavigationSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  /***** Description Bottom Sheet Stuff *****/

  const descriptionBottomSheetModalRef = useRef(null);

  // callbacks
  const handlePresentDesciptionModalPress = useCallback(() => {
    descriptionBottomSheetModalRef.current?.present();
  }, []);
  const handleDesciptionSheetChanges = useCallback((index) => {
    console.log("handleDesciptionSheetChanges", index);
  }, []);

  /***** Leave drill Dialog Stuff *****/

  const [visibleLeaveDrill, setVisibleLeaveDrill] = React.useState(false);

  const showLeaveDrillDialog = () => setVisibleLeaveDrill(true);
  const hideLeaveDrillDialog = () => setVisibleLeaveDrill(false);

  /***** Empty Input Banner Stuff *****/

  const [emptyInputBannerVisable, setEmptyInputBannerVisable] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <SafeAreaView>
          <BottomSheetModalProvider>
            <Appbar.Header
              style={{ backgroundColor: "FFF" }}
              statusBarHeight={0}
            >
              <Appbar.BackAction
                onPress={showLeaveDrillDialog}
                color={"#F24E1E"}
              />
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
            {/* Empty Input Banner */}

            <Banner
              visible={emptyInputBannerVisable}
              actions={[
                {
                  label: "Dismiss",
                  onPress: () => setEmptyInputBannerVisable(false),
                },
              ]}
            >
              Error! All input fields must be filled!
            </Banner>

            <KeyboardAwareScrollView>
              {/* Shot Number / Total shots */}
              <View style={styles.shotNumContainer}>
                <Text style={styles.shotNumber}>
                  Shot {attemptData.shots[shotIndex].shotNum}
                  <Text style={styles.shotTotal}>
                    /{attemptData.shots.length}
                  </Text>
                </Text>
              </View>

              <View style={styles.container}>
                {/* Instruction */}

                <View style={styles.horizontalContainer}>
                  {attemptData.requirements.map((item, id) => (
                    <DrillTarget
                      key={id}
                      description={item.description}
                      distanceMeasure={item.distanceMeasure}
                      value={attemptData.shots[shotIndex].value}
                    />
                  ))}
                </View>

                {/* Inputs */}

                {attemptData.inputs.map((item, id) => (
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

              {/* Test Buttons for navigation between shots and state status */}

              <View style={styles.container}>
                <Button
                  mode="contained-tonal"
                  onPress={() => {
                    //this loop is a test to see if inputs are maintained in state
                    for (let i = 0; i < attemptData.shots.length; i++) {
                      console.log("InputValue[", i, "]: ", inputValues[i]);
                    }
                    console.log(inputValues);
                  }}
                >
                  Log Input State Status
                </Button>

                <Button
                  mode="contained-tonal"
                  onPress={() => {
                    console.log(attemptData);
                  }}
                >
                  Log Input attemptData
                </Button>
              </View>

              {/*Navigation Bottom Sheet */}
              <BottomSheetModal
                ref={navigationBottomSheetModalRef}
                index={1}
                snapPoints={snapPoints}
                onChange={handleNavigationSheetChanges}
              >
                <BottomSheetScrollView>
                  <View style={styles.bottomSheetContentContainer}>
                    {attemptData.shots.map((item, id) => (
                      <Pressable
                        key={id}
                        onPress={() => {
                          setShotIndex(id);
                          navigationBottomSheetModalRef.current.close();
                        }}
                        width={"100%"}
                        alignItems={"center"}
                      >
                        <NavigationRectange
                          key={id}
                          onPress={() => {
                            console.log("Clicked on ", id);
                            setShotIndex(id);
                          }}
                          inputs={attemptData.inputs}
                          target={attemptData.requirements}
                          inputValues={inputValues[id]}
                          shotIndex={item.shotNum}
                          numShots={attemptData.shots.length}
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

              {/* Leave Drill Dialog */}
              <Portal>
                <Dialog
                  visible={visibleLeaveDrill}
                  onDismiss={hideLeaveDrillDialog}
                >
                  <Dialog.Title>Alert</Dialog.Title>
                  <Dialog.Content>
                    <Text variant="bodyMedium">All inputs will be lost.</Text>
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button
                      onPress={() => {
                        hideLeaveDrillDialog();
                        goBack();
                      }}
                    >
                      Leave Drill
                    </Button>
                    <Button
                      onPress={() => {
                        hideLeaveDrillDialog();
                      }}
                    >
                      Cancel
                    </Button>
                  </Dialog.Actions>
                </Dialog>
              </Portal>
            </KeyboardAwareScrollView>

            {/* Navigation */}

            <View style={styles.navigationContainer}>
              {buttonDisplayHandler()}

              <Text
                style={{ color: "#F3572A" }}
                onPress={() => {
                  console.log("Pressed View All Shots");
                  handlePresentNavigationModalPress();
                }}
              >
                View all shots
              </Text>
            </View>
          </BottomSheetModalProvider>
        </SafeAreaView>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  shotNumContainer: {
    flex: 1,
    alignItems: "flex-start",
    marginBottom: 15,
  },
  navigationContainer: {
    alignItems: "center",
    height: "contain",
    justifyContent: "center",
  },
  button: {
    width: "95%",
    height: 52,
    backgroundColor: "#F24E1E",
    marginBottom: 20,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  disabledButton: {
    width: "95%",
    height: 52,
    backgroundColor: "#A0A0A0",
    marginBottom: 20,
    justifyContent: "center",
  },
  disabledButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  shotNumber: {
    fontSize: 32,
    fontWeight: "bold",
  },
  shotTotal: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#A0A0A0",
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
  modalContainerStyle: {
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
