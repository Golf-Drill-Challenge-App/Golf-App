import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
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
import { useLeaderboard } from "~/hooks/useLeaderboard";

/***************************************
 * Firebase Upload
 ***************************************/

async function completeAssigned(
  userId,
  teamId,
  assignedTime,
  drillId,
  attemptId,
  queryClient,
) {
  console.log("WAS IT ASIGNED 5 and ID", assignedTime, userId);

  const userRef = doc(db, "teams", "1", "users", userId);

  const getDocument = async () => {
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());

      const assignedData = docSnap.data()["assigned_data"];
      const updatedAssignedData = assignedData.map((assignment) => {
        if (
          assignment.assignedTime === assignedTime &&
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
        queryClient.invalidateQueries(["user", { teamId, userId }]);
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
  teamId,
  assignedTime,
  drillId,
  queryClient,
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

        // invalidate cache after successful upload
        // TODO: Move this into wherever the update leaderboard hook is?
        invalidateOnSubmit(queryClient, drillId, teamId, userId);

        //Check if drill was assigned
        if (assignedTime) {
          completeAssigned(
            userId,
            teamId,
            assignedTime,
            drillId,
            newAttemptRef.id,
            queryClient,
          );
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
  const leaderboardData = currentLeaderboard;

  //check if the user exists on the leaderboard
  if (leaderboardData[uploadData.uid] == undefined) {
    console.log("User not on leaderboard, uploading this attempt");

    uploadNewLeaderboard(
      leaderboardData,
      drillInfo.mainOutputAttempt,
      uploadData.uid,
      uploadData.did,
      uploadData[drillInfo.mainOutputAttempt],
      uploadData.id,
    );
  } else {
    //used if an attempt already exists
    const currentBest =
      leaderboardData[uploadData.uid]?.[drillInfo.mainOutputAttempt]?.value;

    const lowerIsBetter =
      drillInfo.aggOutputs[drillInfo.mainOutputAttempt].lowerIsBetter;

    //conditional for determining if update is needed
    const isNewAttemptBest = lowerIsBetter
      ? uploadData[drillInfo.mainOutputAttempt] < currentBest
      : uploadData[drillInfo.mainOutputAttempt] > currentBest;

    if (isNewAttemptBest) {
      console.log("New Best Attempt! Time to upload!");

      uploadNewLeaderboard(
        leaderboardData,
        drillInfo.mainOutputAttempt,
        uploadData.uid,
        uploadData.did,
        uploadData[drillInfo.mainOutputAttempt],
        uploadData.id,
      );
    } else {
      console.log("Didn't update");
    }
  }
}

async function uploadNewLeaderboard(
  leaderboardData,
  mainOutputAttempt,
  uid,
  did,
  newValue,
  attemptId,
) {
  const newAttempt = {
    [mainOutputAttempt]: {
      id: attemptId,
      value: newValue,
    },
  };

  //Add new attempt to leaderboard
  leaderboardData[uid] = newAttempt;
  const submitMainOutputAttempt = Object.keys(newAttempt)[0];
  console.log("new attempt");
  console.log(newAttempt);

  //Reference to best_attempts drill document
  const bestAttemptsDrillRef = doc(db, "teams", "1", "best_attempts", did);

  try {
    console.log("LEADERBOARD UPDATE STARTED");
    console.log(submitMainOutputAttempt);

    // get a fresh call without tanstack cache just in case
    const latestLeaderboard = await getDoc(bestAttemptsDrillRef);
    const latestLeaderboardData = latestLeaderboard.data() || {};
    console.log("maybe cached leaderboard");
    console.log(leaderboardData);
    console.log("latest leaderboard");
    console.log(latestLeaderboardData);
    console.log("number of leaderboard entries");
    console.log(Object.keys(latestLeaderboardData).length);

    if (latestLeaderboard.exists()) {
      if (latestLeaderboardData[uid]) {
        const updatedLeaderboardUser = latestLeaderboardData[uid];

        // Handle potential future case of multiple mainOutputAttempt values per drill & user
        updatedLeaderboardUser[submitMainOutputAttempt] =
          newAttempt[submitMainOutputAttempt];
        await updateDoc(bestAttemptsDrillRef, {
          [uid]: updatedLeaderboardUser,
        }).then(
          console.log(
            "Leaderboard has been updated (updated user personal best) (updateDoc)!",
          ),
        );
      } else {
        // if it's user's first submission, don't need to handle multiple mainOutputAttempt values
        await updateDoc(bestAttemptsDrillRef, {
          [uid]: newAttempt,
        }).then(
          console.log(
            "Leaderboard has been updated (user's first submission) (updateDoc)!",
          ),
        );
      }
    } else {
      // Edge case for if the best_attempts > drillId document doesn't exist (shouldn't come up in current scope)
      await setDoc(bestAttemptsDrillRef, {
        [uid]: newAttempt,
      }).then(
        console.log(
          "Leaderboard has been updated (leaderboard did not exist previously, created new best_attempts document) (setDoc)!",
        ),
      );
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

// TODO: Maybe refactor this to a hook / combo with new refreshInvalidate component (if other button actions etc need to
// invalidate multiple queries at once)
function invalidateOnSubmit(queryClient, drillId, teamId, userId) {
  queryClient.invalidateQueries({
    // used predicate as it seemed to be the best method to invalidate multiple query keys
    predicate: (query) =>
      query.queryKey[0] === "user" ||
      query.queryKey[0] === "drillInfo" ||
      (query.queryKey[0] === "best_attempts" && // not sure the leaderboard updates correctly
        query.queryKey[1] === teamId &&
        query.queryKey[2].drillId === drillId) ||
      (query.queryKey[0] === "attempts" &&
        query.queryKey[1] === teamId &&
        (query.queryKey[2].drillId === drillId || // stats pages
          query.queryKey[2].userId === userId)), // for profile index (list of drill types)
  });
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
      uploadAttempt(
        outputData,
        currentUserId,
        currentTeamId,
        assignedTime,
        id,
        queryClient,
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
    return (
      <ErrorComponent
        message={[userError, drillError, attemptError, leaderboardError]}
      />
    );
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
                style={{ color: themeColors.accent }}
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
    height: "contain",
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
