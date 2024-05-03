import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  runTransaction,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View, useWindowDimensions } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Appbar, Button, Text } from "react-native-paper";
import {
  SafeAreaInsetsContext,
  SafeAreaView,
} from "react-native-safe-area-context";
import { themeColors } from "~/Constants";
import {
  getIconByKey,
  lookUpBaselineStrokesGained,
  lookUpExpectedPutts,
} from "~/Utility";
import DialogComponent from "~/components/dialog";
import DrillDescription from "~/components/drillDescription";
import ErrorComponent from "~/components/errorComponent";
import Header from "~/components/header";
import DrillInput from "~/components/input/drillInput";
import DrillTarget from "~/components/input/drillTarget";
import NavigationRectangle from "~/components/input/navigationRectangle";
import Loading from "~/components/loading";
import PaperWrapper from "~/components/paperWrapper";
import { currentAuthContext } from "~/context/Auth";
import { db } from "~/firebaseConfig";
import { invalidateMultipleKeys } from "~/hooks/invalidateMultipleKeys";
import { useLeaderboard } from "~/hooks/useLeaderboard";

/***************************************
 * Firebase Upload
 ***************************************/

async function completeAssigned(userId, assignedTime, drillId, attemptId) {
  console.log("WAS IT ASIGNED 5 and ID", assignedTime, userId);

  const userRef = doc(db, "teams", "1", "users", userId);

  const getDocument = async () => {
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());

      const assignedData = docSnap.data()["assigned_data"];
      const updatedAssignedData = assignedData.map((assignment) => {
        if (
          assignment.assignedTime == assignedTime &&
          assignment.drillId === drillId
        ) {
          return { ...assignment, completed: true, attemptId: attemptId };
        }
        return assignment;
      });

      console.log("DOCUMENT DATA INSIDE", updatedAssignedData[0].completed);

      try {
        await updateDoc(userRef, { assigned_data: updatedAssignedData });
        console.log("Document updated successfully!");
      } catch (error) {
        console.error("Error updating document:", error);
      }
    } else {
      console.log("No such document!");
    }
  };

  getDocument();
}

//A function to upload the outputData to the "attempts" collection
async function uploadAttempt(
  outputData,
  userId,
  assignedTime,
  drillId,
  drillInfo,
  currentLeaderboard,
) {
  console.log("WAS IT ASIGNED 4 and ID", assignedTime, userId);

  try {
    //create new document
    const newAttemptRef = doc(collection(db, "teams", "1", "attempts"));

    //Newly created doc Id. Useful for finding upload data in testing.
    console.log("New Attempt Ref ID: ", newAttemptRef.id);

    //add id of new document into the data
    const uploadData = { ...outputData, id: newAttemptRef.id };

    //upload the data
    await setDoc(newAttemptRef, uploadData)
      .then(() => {
        console.log("Document successfully uploaded!");

        //Call function to check for leaderboard update
        handleLeaderboardUpdate(uploadData, drillInfo, currentLeaderboard);

        //Check if drill was assigned
        if (assignedTime) {
          completeAssigned(userId, assignedTime, drillId, newAttemptRef.id);
        }
      })
      .catch((error) => {
        console.error("Error uploading document: ", error);
      });
  } catch (e) {
    alert(e);
    console.log(e);
  }
}

//A function to check leaderboard and update if needed
function handleLeaderboardUpdate(uploadData, drillInfo, currentLeaderboard) {
  const mainOutputAttempt = drillInfo.mainOutputAttempt;

  //check if the user exists on the leaderboard
  if (currentLeaderboard[uploadData.uid] == undefined) {
    console.log("User not on leaderboard, uploading this attempt");

    uploadNewLeaderboard(mainOutputAttempt, uploadData);
  } else {
    //used if an attempt already exists
    const currentBest =
      currentLeaderboard[uploadData.uid][mainOutputAttempt].value;

    const lowerIsBetter = drillInfo.aggOutputs[mainOutputAttempt].lowerIsBetter;

    //conditional for determining if update is needed
    const isNewAttemptBest = lowerIsBetter
      ? uploadData[mainOutputAttempt] < currentBest
      : uploadData[mainOutputAttempt] > currentBest;

    if (isNewAttemptBest) {
      console.log("New Best Attempt! Time to upload!");

      uploadNewLeaderboard(mainOutputAttempt, uploadData);
    } else {
      console.log("Didn't update");
    }
  }
}

async function uploadNewLeaderboard(mainOutputAttempt, uploadData) {
  const attemptId = uploadData.id;
  const attemptValue = uploadData[mainOutputAttempt];

  const newAttempt = {
    [mainOutputAttempt]: {
      id: attemptId,
      value: attemptValue,
    },
  };

  //Reference to best_attempts drill document
  const bestAttemptsDrillRef = doc(
    db,
    "teams",
    "1",
    "best_attempts",
    uploadData.did,
  );

  try {
    console.log("LEADERBOARD UPDATE STARTED");

    // https://firebase.google.com/docs/firestore/manage-data/transactions#transactions
    // firebase transactions to avoid race conditions on get + update leaderboard
    try {
      await runTransaction(db, async (transaction) => {
        // get latest leaderboard data again, just in case another player updated best score just now
        const latestLeaderboard = await transaction.get(bestAttemptsDrillRef);
        if (!latestLeaderboard.exists()) {
          // No automation set up to create new leaderboards when new drills (or mainOutputAttempts) are added.
          // So idk if this error (best_attempts > drill id) needs to be handled better than just a throw.
          // If so, check if set / setDoc plays nicely with transactions.
          throw "Document does not exist!";
        }
        transaction.update(bestAttemptsDrillRef, {
          [uploadData.uid]: newAttempt,
        });
      });
      console.log("Transaction (leaderboard update) successfully committed!");
    } catch (e) {
      console.log("Transaction (leaderboard update) failed: ", e);
    }
  } catch (e) {
    alert(e);
    console.log(e);
  }
}

/***************************************
 * AttemptShots Generation
 ***************************************/
function getShotInfo(drillInfo) {
  let shots = [];
  switch (drillInfo.requirements[0].type) {
    case "random":
      shots = fillRandomShotTargets(drillInfo);
      break;
    case "sequence":
      shots = fillClubTargets(drillInfo);
      break;
    case "putt":
      shots = fillPuttTargets(drillInfo);
      break;
    default:
      console.log("Shots not found");
      break;
  }

  return shots;
}

//Helper function for the sequence drill type
function fillClubTargets(drillInfo) {
  let shots = [];
  for (var i = 0; i < drillInfo.reps; i++) {
    shots.push({
      shotNum: i + 1,
      items: {
        [drillInfo.requirements[0].name]: drillInfo.requirements[0].items[i],
      },
    });
  }
  return shots;
}

//Helper function for the random drill type
function fillRandomShotTargets(drillInfo) {
  const minCeiled = Math.ceil(drillInfo.requirements[0].min);
  const maxFloored = Math.floor(drillInfo.requirements[0].max);
  let shots = [];

  for (var i = 0; i < drillInfo.reps; i++) {
    var target = Math.floor(
      Math.random() * (maxFloored - minCeiled + 1) + minCeiled,
    );
    var baseline = lookUpBaselineStrokesGained(target);
    shots.push({
      shotNum: i + 1,
      items: {
        [drillInfo.requirements[0].name]: target,
      },
      baseline: baseline,
    });
  }
  return shots;
}

//Helper function for the putt drill type
function fillPuttTargets(drillInfo) {
  let shots = [];
  for (var i = 0; i < drillInfo.reps; i++) {
    var baseline = lookUpExpectedPutts(drillInfo.requirements[0].items[i]);
    let target = {};
    for (var j = 0; j < drillInfo.requirements.length; j++) {
      target = Object.assign(target, {
        [drillInfo.requirements[j].name]: drillInfo.requirements[j].items[i],
      });
    }
    shots.push({
      shotNum: i + 1,
      baseline: baseline,
      items: target,
    });
  }

  return shots;
}

/***************************************
 * Output Data Generation
 ***************************************/

//Helper funciton for createOutputData to calculate the Carry Difference
function calculateProxHole(target, carry, sideLanding) {
  let carryDiff = calculateCarryDiff(target, carry);
  return Math.sqrt(Math.pow(carryDiff * 3, 2) + Math.pow(sideLanding, 2));
}
//Helper funciton for createOutputData to calculate the Carry Difference
function calculateCarryDiff(target, carry) {
  return Math.abs(carry - target);
}

//Function to create and format output data
function createOutputData(drillInfo, inputValues, attemptShots, uid, did) {
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
    for (let i = 0; i < drillInfo.outputs.length; i++) {
      const output = drillInfo.outputs[i];

      switch (output) {
        case "target":
          shot.target = attemptShots[j].items.target;
          break;

        case "club":
          shot.club = attemptShots[j].items.club;
          break;

        case "carry":
          shot.carry = inputValues[j].carry;
          break;

        case "strokes":
          shot.strokes = inputValues[j].strokes;
          break;

        case "break":
          shot.break = attemptShots[j].items.break;
          break;

        case "sideLanding":
          shot.sideLanding = Number(inputValues[j].sideLanding);
          sideLandingTotal += Math.abs(Number(inputValues[j].sideLanding));
          break;

        case "proxHole":
          shot.proxHole = calculateProxHole(
            attemptShots[j].items.target,
            inputValues[j].carry,
            inputValues[j].sideLanding,
          );
          proxHoleTotal += calculateProxHole(
            attemptShots[j].items.target,
            inputValues[j].carry,
            inputValues[j].sideLanding,
          );
          break;

        case "baseline":
          shot.baseline = attemptShots[j].baseline;
          break;

        case "expectedPutts":
          shot.expectedPutts = lookUpExpectedPutts(
            calculateProxHole(
              attemptShots[j].items.target,
              inputValues[j].carry,
              inputValues[j].sideLanding,
            ),
          );
          break;

        case "strokesGained":
          switch (drillInfo.shotType) {
            case "app":
              shot.strokesGained =
                attemptShots[j].baseline -
                lookUpExpectedPutts(
                  calculateProxHole(
                    attemptShots[j].items.target,
                    inputValues[j].carry,
                    inputValues[j].sideLanding,
                  ),
                ) -
                1;
              break;
            case "putt":
              shot.strokesGained =
                attemptShots[j].baseline - inputValues[j].strokes;
              break;
            default:
              console.log("Shot type does not exist.");
              break;
          }

          strokesGainedTotal += shot.strokesGained;
          break;

        case "carryDiff":
          shot.carryDiff = calculateCarryDiff(
            attemptShots[j].items.target,
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
    shot.sid = j + 1;

    //push the shot into the array
    outputShotData.push(shot);
  }

  console.log("outputShotData", outputShotData);

  //get the time stamp
  const timeStamp = Date.now();

  //create the outputData object
  const outputData = {
    time: timeStamp,
    did: did,
    uid: uid,
    shots: outputShotData,
  };

  //Generate the aggOutputs for output data
  const aggOutputsArr = Object.keys(drillInfo.aggOutputs);
  for (let i = 0; i < aggOutputsArr.length; i++) {
    const aggOutput = aggOutputsArr[i];

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

  return outputData;
}

//A function to validate inputs are not empty
function checkEmptyInputs(inputs) {
  return Object.values(inputs).some((value) => value === "");
}

//A function to validate inputs are all numbers
function validateInputs(inputs) {
  return Object.values(inputs).some((input) => isNaN(input));
}

export default function Input({ drillInfo, setToggleResult, setOutputData }) {
  //Helper varibles
  const { id, assignedTime } = useLocalSearchParams();
  const insets = useContext(SafeAreaInsetsContext);
  const queryClient = useQueryClient();

  const numInputs = drillInfo.inputs.length;

  const navigation = useNavigation();

  const { currentUserId, currentTeamId } = currentAuthContext();

  const { height } = useWindowDimensions();

  //a useState hook to track the inputs on each shot
  const [inputValues, setInputValues] = useState(
    Array.from({ length: drillInfo.reps }, () => ({})),
  );

  const [attemptShots, setattemptShots] = useState([]); //a useState hook to hold the requirements of each shot

  const [displayedShot, setDisplayedShot] = useState(0); //a useState hook to track what shot is displayed

  const [currentShot, setCurrentShot] = useState(0); //a useState hook to track current shot

  const { id: did } = useLocalSearchParams();

  const {
    data: currentLeaderboard,
    isLoading: leaderboardIsLoading,
    error: leaderboardError,
  } = useLeaderboard({ drillId: did });

  /***** Navigation Bottom Sheet stuff *****/
  const navModalRef = useRef(null);

  /***** Description Bottom Sheet Stuff *****/

  const descriptionModalRef = useRef(null);

  /***** Empty Input dialog Stuff *****/
  const [emptyDialogVisible, setEmptyDialogVisible] = useState(false);
  const hideEmptyDialog = () => setEmptyDialogVisible(false);

  /***** Invalid Input dialog Stuff *****/
  const [invalidDialogVisible, setInvalidDialogVisible] = useState(false);
  const hideInvalidDialog = () => setInvalidDialogVisible(false);

  //useEffectHook to set the attempts shot requirements
  useEffect(() => {
    setattemptShots(getShotInfo(drillInfo));
  }, []);

  //Varible to store if Submit button is active
  const submitVisible =
    currentShot === drillInfo.reps - 1 && displayedShot === drillInfo.reps - 1;

  //Changes the button depending on the current shot and shot index
  const buttonDisplayHandler = () => {
    //Logic to display "Submit Drill"
    if (submitVisible) {
      return (
        <Button
          style={styles.button}
          labelStyle={styles.buttonText}
          mode="contained-tonal"
          onPress={handleButtonClick}
        >
          Submit Drill
        </Button>
      );
    }

    //Logic to dislay "Next Shot"
    if (displayedShot !== currentShot) {
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
    }

    //Logic to dislay "Next Shot"
    return (
      <Button
        style={styles.button}
        labelStyle={styles.buttonText}
        mode="contained-tonal"
        onPress={handleButtonClick}
      >
        Next Shot
      </Button>
    );
  };

  //Function to help in maintaing State of inputs
  const handleInputChange = (id, newText) => {
    setInputValues((prevValues) => {
      const updatedValues = [...prevValues];
      updatedValues[displayedShot] = {
        ...updatedValues[displayedShot],
        [id]: newText,
      };
      return updatedValues;
    });
  };

  //Function to handle "Next shot" button click
  const handleButtonClick = () => {
    // need to declare userId and drillId like this due to obj destructuring / how query keys are defined in
    // useAttempts / useDrillInfo hooks
    const userId = currentUserId;
    const drillId = did;
    const invalidateKeys = [
      ["user"],
      ["drillInfo"],
      ["best_attempts", currentTeamId, drillId], // keep currentTeamId param as it is a string argument in useLeaderboard's query key
      ["attempts", { drillId }], // stats pages
      ["attempts", { userId }], // for profile index (list of drill types)
    ];

    //Check if all inputs have been filled in
    if (
      Object.keys(inputValues[displayedShot]).length !== numInputs ||
      checkEmptyInputs(inputValues[displayedShot])
    ) {
      setEmptyDialogVisible(true);
    }
    //check inputs are all numbers
    else if (validateInputs(inputValues[displayedShot])) {
      setInvalidDialogVisible(true);
    }
    //check for submit button
    else if (submitVisible) {
      let outputData = createOutputData(
        drillInfo,
        inputValues,
        attemptShots,
        currentUserId,
        did,
      );

      setOutputData(outputData);
      // invalidate cache on button press
      invalidateMultipleKeys(queryClient, invalidateKeys);
      uploadAttempt(
        outputData,
        currentUserId,
        assignedTime,
        id,
        drillInfo,
        currentLeaderboard,
      );
      setToggleResult(true);
    } else {
      setDisplayedShot(displayedShot + 1);
      setCurrentShot(currentShot + 1);
    }
  };

  //Loading until an attempt is generated
  if (attemptShots.length === 0 || leaderboardIsLoading) {
    console.log("Loading");
    return <Loading />;
  }

  if (leaderboardError) {
    return <ErrorComponent message={[leaderboardError]} />;
  }

  return (
    <PaperWrapper>
      <SafeAreaView style={{ height: height }}>
        <View style={{ height: "100%" }}>
          <BottomSheetModalProvider>
            <Header
              title={drillInfo.drillType}
              subTitle={drillInfo.subType}
              preChildren={
                <Appbar.Action
                  icon="close"
                  onPress={() => navigation.goBack()}
                  color={themeColors.accent}
                />
              }
              postChildren={
                <Appbar.Action
                  icon="information-outline"
                  onPress={() => {
                    descriptionModalRef.current?.present();
                  }}
                  color={themeColors.accent}
                />
              }
            />

            <KeyboardAwareScrollView>
              {/* Shot Number / Total shots */}
              <View style={styles.shotNumContainer}>
                <Text style={styles.shotNumber}>
                  Shot {attemptShots[displayedShot].shotNum}
                  <Text style={styles.shotTotal}>/{attemptShots.length}</Text>
                </Text>
              </View>

              <View style={styles.container}>
                {/* Instruction */}

                <View style={styles.horizontalContainer}>
                  {drillInfo.requirements.map((item, id) => (
                    <DrillTarget
                      key={id}
                      prompt={item.prompt}
                      distanceMeasure={item.distanceMeasure}
                      target={attemptShots[displayedShot].items[item.name]}
                    />
                  ))}
                </View>

                {/* Inputs */}

                {drillInfo.inputs.map((item, id) => (
                  <DrillInput
                    key={id}
                    icon={getIconByKey(item.id)}
                    prompt={item.prompt}
                    helperText={item.helperText}
                    distanceMeasure={item.distanceMeasure}
                    inputValue={inputValues[displayedShot]?.[item.id] || ""}
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
                ref={navModalRef}
                enableDynamicSizing
                backdropComponent={({ animatedIndex, style }) => {
                  return (
                    <BottomSheetBackdrop
                      appearsOnIndex={0}
                      disappearsOnIndex={-1}
                      animatedIndex={animatedIndex}
                      style={[style, { top: -insets.top }]}
                    />
                  );
                }}
                backgroundStyle={{ backgroundColor: themeColors.background }}
              >
                <BottomSheetScrollView>
                  <View style={styles.bottomSheetContentContainer}>
                    {attemptShots.slice(0, currentShot + 1).map((item, id) => (
                      <NavigationRectangle
                        key={id}
                        drillInfo={drillInfo}
                        shot={item}
                        inputValues={inputValues[id]}
                        currentShot={currentShot}
                        pressFunction={() => {
                          setDisplayedShot(id);
                          navModalRef.current.close();
                        }}
                      />
                    ))}
                  </View>
                </BottomSheetScrollView>
              </BottomSheetModal>

              {/* Description Bottom Sheet */}
              <BottomSheetModal
                ref={descriptionModalRef}
                enableDynamicSizing
                backdropComponent={({ animatedIndex, style }) => {
                  return (
                    <BottomSheetBackdrop
                      appearsOnIndex={0}
                      disappearsOnIndex={-1}
                      animatedIndex={animatedIndex}
                      style={[style, { top: -insets.top }]}
                    />
                  );
                }}
                backgroundStyle={{ backgroundColor: themeColors.background }}
              >
                <BottomSheetScrollView>
                  <Text style={{ marginLeft: 10 }} variant="headlineLarge">
                    Description
                  </Text>
                  <DrillDescription drillData={drillInfo} />
                </BottomSheetScrollView>
              </BottomSheetModal>

              {/* Error Dialog: Empty Input*/}
              <DialogComponent
                type={"snackbar"}
                title={"Error!"}
                content="All inputs must be filled."
                visible={emptyDialogVisible}
                onHide={hideEmptyDialog}
              />

              {/* Error Dialog: Invalid Input*/}
              <DialogComponent
                type={"snackbar"}
                title={"Error!"}
                content="All inputs must be numbers."
                visible={invalidDialogVisible}
                onHide={hideInvalidDialog}
              />
            </KeyboardAwareScrollView>
            {/* Navigation */}
            <View style={styles.navigationContainer}>
              <Text
                onPress={() => {
                  const newInputValues = Array.from(
                    { length: attemptShots.length },
                    () => ({}),
                  );
                  for (let i = 0; i < attemptShots.length; i++) {
                    drillInfo.inputs.forEach((item) => {
                      switch (item.id) {
                        case "carry":
                          newInputValues[i][item.id] = Math.floor(
                            Math.random() *
                              attemptShots[displayedShot].items["target"] +
                              attemptShots[displayedShot].items["target"] / 2,
                          ).toString();
                          break;
                        case "sideLanding":
                          newInputValues[i][item.id] = Math.floor(
                            Math.random() * 21 - 10,
                          ).toString();
                          break;
                        case "strokes":
                          newInputValues[i][item.id] = Math.floor(
                            Math.random() * 2 + 1,
                          ).toString();
                          break;
                      }
                    });
                  }
                  setInputValues(newInputValues);
                  setDisplayedShot(attemptShots.length - 1);
                  setCurrentShot(attemptShots.length - 1);
                }}
              >
                Fill in all inputs
              </Text>
              {buttonDisplayHandler()}

              <Text
                style={{
                  color: themeColors.accent,
                  paddingBottom: Platform.OS === "android" ? 10 : 30,
                  fontSize: 16,
                }}
                onPress={() => {
                  navModalRef.current?.present();
                }}
              >
                View all shots
              </Text>
            </View>
          </BottomSheetModalProvider>
        </View>
      </SafeAreaView>
    </PaperWrapper>
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
    marginLeft: 10,
  },
  navigationContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: "95%",
    backgroundColor: themeColors.accent,
    marginBottom: 20,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    padding: 5,
  },
  disabledButton: {
    width: "95%",
    backgroundColor: "#A0A0A0",
    marginBottom: 20,
    justifyContent: "center",
  },
  disabledButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    padding: 10,
  },
  title: {
    fontSize: 20,
  },
  subTitle: {
    fontSize: 12,
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
    gap: 10,
    paddingVertical: 20,
  },
  modalContainerStyle: {
    backgroundColor: themeColors.background,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
