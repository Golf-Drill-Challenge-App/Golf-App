import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
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
import { getIconByKey, lookUpExpectedPutts } from "~/Utility";
import DrillInput from "~/components/input/drillInput";
import DrillTarget from "~/components/input/drillTarget";
import NavigationRectangle from "~/components/input/navigationRectangle";
import Description from "./modals/description";
import { lookUpBaselineStrokesGained } from "~/Utility";

function calculateProxHole(target, carry, sideLanding) {
  let carryDiff = calculateCarryDiff(target, carry);
  return Math.sqrt(Math.pow(carryDiff * 3, 2) + Math.pow(sideLanding, 2));
}

function calculateCarryDiff(target, carry) {
  return Math.abs(carry - target);
}

function createOutputData(inputValues, attemptInfo, did, outputs, aggOutputs) {
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
          shot.target = attemptInfo.shots[j].target;
          break;

        case "carry":
          shot.carry = inputValues[j].carry;
          break;

        case "sideLanding":
          shot.sideLanding = Number(inputValues[j].sideLanding);
          sideLandingTotal += Number(inputValues[j].sideLanding);
          break;

        case "proxHole":
          shot.proxHole = calculateProxHole(
            attemptInfo.shots[j].target,
            inputValues[j].carry,
            inputValues[j].sideLanding,
          );
          proxHoleTotal += shot.proxHole;
          break;

        case "baseline":
          shot.baseline = attemptInfo.shots[j].baseline;
          break;

        case "expectedPutts":
          shot.expectedPutts = lookUpExpectedPutts(
            calculateProxHole(
              attemptInfo.shots[j].target,
              inputValues[j].carry,
              inputValues[j].sideLanding,
            ),
          );
          break;

        case "strokesGained":
          const baseline = lookUpBaselineStrokesGained(shots[j].target);
          shot.strokesGained =
            baseline -
            lookUpExpectedPutts(
              calculateProxHole(
                attemptInfo.shots[j].target,
                inputValues[j].carry,
                inputValues[j].sideLanding,
              ),
            ) - 1;
          strokesGainedTotal += shot.strokesGained;
          break;

        case "carryDiff":
          shot.carryDiff = calculateCarryDiff(
            attemptInfo.shots[j].target,
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

  //get uid
  //TODO: figure out how to get this information
  const uid = "c0nEyjaOMhItMQTLMY0X"; //temporary until we can get this from params

  //create the outputData object
  const outputData = {
    time: timeStamp,
    did: did,
    uid: uid,
    shots: outputShotData,
  };

  //Generate the aggOutputs for output data
  for (let i = 0; i < aggOutputs.length; i++) {
    const aggOutput = aggOutputs[i];

    switch (aggOutput) {
      case "carryDiffAverage":
        outputData.carryDiffAverage = carryDiffTotal / inputValues.length;
        break;

      case "proxHoleAverage":
        outputData.proxHoleAverage = proxHoleTotal / inputValues.length;
        break;

      case "sideLandingAverage":
        outputData.sideLandingAverage = sideLandingTotal / inputValues.length;
        break;

      case "strokesGained":
        outputData.strokesGained = strokesGainedTotal;
        break;

      case "strokesGainedAverage":
        outputData.strokesGainedAverage =
          strokesGainedTotal / inputValues.length;
        break;

      case "sideLandingTotal":
        outputData.sideLandingTotal = sideLandingTotal;
        break;

      default:
        console.log("Output Calculation not found\n");
        break;
    }
  }

  return {
    outputData,
  };
}

export default function Input({ drillInfo, setToggleResult, setOutputData }) {
  //Helper varibles
  const numInputs = drillInfo["inputs"].length;
  const numShots = drillInfo["reps"];

  const navigation = useNavigation();

  //a useState hook to track the inputs on each shot
  const [shotRequirements, setShotRequirements] = useState([]);
  const [shotInputs, setShotInputs] = useState([])

  const [displayedShot, setDisplayedShot] = useState(0); //a useState hook to track what shot index

  const [currentShot, setCurrentShot] = useState(0); //a useState hook to track current shot

  useEffect(() => {
    const newShots = Array.from({ drillInfo["rep"] }, () => ({}))
    drillInfo["requirement"].forEach((requirement) => {
      switch (requirement["type"]) {
        case "sequence": {
          for (let i = 0; i < drillInfo.reps; i++) {
            newShots[i] = {
              target: drillInfo.requirements[0].items[i],
            };
          }
        }
        case "random":{
          const minCeiled = Math.ceil(requirement["min"]);
          const maxFloored = Math.floor(requirement["max"]);

          for (var i = 0; i < drillInfo.reps; i++) {
            var target = Math.floor(
              Math.random() * (maxFloored - minCeiled + 1) + minCeiled,
            );
            var baseline = lookUpBaselineStrokesGained(target);
            shots.push({
              shotNum: i + 1,
              target: target,
              baseline: baseline,
            });
          }
        }
      }
    });
  }, []);

  const fillRandomShotTargets = (min, max) => {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    let shots = [];

    for (var i = 0; i < drillInfo.reps; i++) {
      var target = Math.floor(
        Math.random() * (maxFloored - minCeiled + 1) + minCeiled,
      );
      var baseline = lookUpBaselineStrokesGained(target);
      shots.push({
        shotNum: i + 1,
        target: target,
        baseline: baseline,
      });
    }
    return shots;
  };

  const fillClubTargets = () => {
    let shots = [];
    for (var i = 0; i < drillInfo.reps; i++) {
      shots.push({
        shotNum: i + 1,
        target: drillInfo.requirements[0].items[i],
      });
    }
    return shots;
  };

  const getShotInfo = () => {
    switch (drillInfo.drillType) {
      case "20 Shot Challenge":
        attemptInfo.shots = fillRandomShotTargets(
          drillInfo.requirements[0].min,
          drillInfo.requirements[0].max,
        ); //current this is getting recalled everytime state changes
        break;
      case "Line Test":
        attemptInfo.shots = fillClubTargets();
        break;
      default:
        attemptInfo.shots = null;
        break;
    }
    return;
  };

  const { id: did } = useLocalSearchParams();

  //Changes the button depending on the current shot and shot index
  const buttonDisplayHandler = () => {
    if (currentShot !== displayedShot)
      return (
        <Button
          style={styles.disabledButton}
          labelStyle={styles.buttonText}
          mode="contained-tonal"
          onPress={() => {
            setDisplayedShot(currentShot);
          }}
        >
          Back to Latest
        </Button>
      );

    //Logic to display "Submit Drill"
    if (currentShot === numShots)
      return (
        <Button
          style={styles.button}
          labelStyle={styles.buttonText}
          mode="contained-tonal"
          onPress={() => {
            setOutputData(
              createOutputData(
                shotRequirements,
                did,
                drillInfo.outputs,
                drillInfo.aggOutputs,
              ),
            );
            //send the output data to the database here
            setToggleResult(true);
          }}
        >
          Submit Drill
        </Button>
      );

    //Logic to dislay "Next Shot"
    return (
      <Button
        style={styles.button}
        labelStyle={styles.buttonText}
        mode="contained-tonal"
        onPress={handleNextShotButtonClick}
      >
        Next Shot
      </Button>
    );
  };

  //Function to help in maintaing State of inputs
  const handleInputChange = (id, newText) => {
    setShotRequirements((prevValues) => {
      const updatedValues = [...prevValues];
      updatedValues[displayedShot] = {
        ...updatedValues[displayedShot],
        [id]: newText,
      };
      return updatedValues;
    });
  };

  //Function to handle "Next shot" button click
  const handleNextShotButtonClick = () => {
    //Check if all inputs have been filled in
    if (Object.keys(shotRequirements[displayedShot]).length === numInputs) {
      setEmptyInputBannerVisible(false);
      setDisplayedShot(displayedShot + 1);
      setCurrentShot(currentShot + 1);
    } else {
      setEmptyInputBannerVisible(true);
    }
  };

  /***** Navigation Bottom Sheet stuff *****/
  const navigationModalRef = useRef(null);

  const snapPoints = useMemo(() => ["50%", "90%"], []);

  /***** Description Bottom Sheet Stuff *****/

  const descriptionModalRef = useRef(null);

  /***** Leave drill Dialog Stuff *****/

  const [leaveDialogVisible, setLeaveDialogVisible] = React.useState(false);

  const showLeaveDialog = () => setLeaveDialogVisible(true);
  const hideLeaveDialog = () => setLeaveDialogVisible(false);

  /***** Empty Input Banner Stuff *****/

  const [emptyInputBannerVisible, setEmptyInputBannerVisible] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <SafeAreaView>
          <View style={{ height: "100%" }}>
            <BottomSheetModalProvider>
              <Appbar.Header
                style={{ backgroundColor: "FFF" }}
                statusBarHeight={0}
              >
                <Appbar.Action
                  icon="close"
                  onPress={showLeaveDialog}
                  color={"#F24E1E"}
                />
                <Appbar.Content
                  title={drillInfo.drillTitle}
                  titleStyle={styles.title}
                />
                <Appbar.Action
                  icon="information-outline"
                  onPress={() => {
                    descriptionModalRef.current?.present();
                  }}
                  color={"#F24E1E"}
                />
              </Appbar.Header>
              {/* Empty Input Banner */}

              <Banner
                visible={emptyInputBannerVisible}
                actions={[
                  {
                    label: "Dismiss",
                    onPress: () => setEmptyInputBannerVisible(false),
                  },
                ]}
              >
                Error! All input fields must be filled!
              </Banner>

              <KeyboardAwareScrollView>
                {/* Shot Number / Total shots */}
                <View style={styles.shotNumContainer}>
                  <Text style={styles.shotNumber}>
                    Shot {displayedShot + 1}
                    <Text style={styles.shotTotal}>/{numShots}</Text>
                  </Text>
                </View>

                <View style={styles.container}>
                  {/* Instruction */}

                  <View style={styles.horizontalContainer}>
                    {drillInfo.requirements.map((item, id) => (
                      <DrillTarget
                        key={id}
                        drillTitle={drillInfo.drillType}
                        distanceMeasure={item.distanceMeasure}
                        target={shotRequirements[displayedShot].target}
                      />
                    ))}
                  </View>

                  {/* Inputs */}

                  {drillInfo.inputs.map((item, id) => (
                    <DrillInput
                      key={id}
                      icon={getIconByKey(item.id)}
                      prompt={item.prompt}
                      distanceMeasure={item.distanceMeasure}
                      inputValue={shotRequirements[displayedShot]?.[item.id] || ""}
                      onInputChange={(newText) => {
                        handleInputChange(item.id, newText);
                      }}
                      currentShot={currentShot}
                      displayedShot={displayedShot}
                    />
                  ))}
                </View>

                {/*Navigation Bottom Sheet */}
                <BottomSheetModal
                  ref={navigationModalRef}
                  index={1}
                  snapPoints={snapPoints}
                >
                  <BottomSheetScrollView>
                    <View style={styles.bottomSheetContentContainer}>
                      {shotRequirements.map((item, id) => (
                        <Pressable
                          key={id}
                          onPress={() => {
                            setDisplayedShot(id);
                            navigationModalRef.current.close();
                          }}
                          width={"100%"}
                          alignItems={"center"}
                        >
                          <NavigationRectangle
                            key={id}
                            inputs={drillInfo.inputs}
                            target={drillInfo.requirements[0]}
                            targetValue={shotRequirements[id].target}
                            inputValues={shotRequirements[id]}
                            shotIndex={item.shotNum}
                            numShots={numShots}
                          />
                        </Pressable>
                      ))}
                    </View>
                  </BottomSheetScrollView>
                </BottomSheetModal>

                {/* Description Bottom Sheet */}
                <BottomSheetModal
                  ref={descriptionModalRef}
                  index={1}
                  snapPoints={snapPoints}
                >
                  <BottomSheetScrollView>
                    <Description />
                  </BottomSheetScrollView>
                </BottomSheetModal>

                {/* Leave Drill Dialog */}
                <Portal>
                  <Dialog
                    visible={leaveDialogVisible}
                    onDismiss={hideLeaveDialog}
                  >
                    <Dialog.Title>Alert</Dialog.Title>
                    <Dialog.Content>
                      <Text variant="bodyMedium">All inputs will be lost.</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                      <Button
                        onPress={() => {
                          hideLeaveDialog();
                          navigation.goBack();
                        }}
                      >
                        Leave Drill
                      </Button>
                      <Button onPress={hideLeaveDialog}>Cancel</Button>
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
                    navigationModalRef.current?.present();
                  }}
                >
                  View all shots
                </Text>
              </View>
            </BottomSheetModalProvider>
          </View>
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
