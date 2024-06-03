import {
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View, useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Appbar, Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "~/Constants";
import {
  getErrorString,
  getIconByKey,
  lookUpBaselineStrokesGained,
  lookUpExpectedPutts,
} from "~/Utility";
import BottomSheetWrapper from "~/components/bottomSheetWrapper";
import DialogComponent from "~/components/dialog";
import DrillDescription from "~/components/drillDescription";
import ErrorComponent from "~/components/errorComponent";
import Header from "~/components/header";
import DrillInput from "~/components/input/drillInput";
import DrillTarget from "~/components/input/drillTarget";
import NavigationRectangle from "~/components/input/navigationRectangle";
import Loading from "~/components/loading";
import PaperWrapper from "~/components/paperWrapper";
import { useAuthContext } from "~/context/Auth";
import { db } from "~/firebaseConfig";
import { invalidateMultipleKeys } from "~/hooks/invalidateMultipleKeys";
import { useBestAttempts } from "~/hooks/useBestAttempts";
import { useDrillInfo } from "~/hooks/useDrillInfo";
import { useUserInfo } from "~/hooks/useUserInfo";

/***************************************
 * Attempt Submission functions
 ***************************************/

//A function to check if a drill was assigned upon completion
async function completeAssigned(
  userId,
  assignedTime,
  drillId,
  attemptId,
  currentTeamId,
) {
  const userRef = doc(db, "teams", currentTeamId, "users", userId);

  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
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

    try {
      await updateDoc(userRef, { assigned_data: updatedAssignedData });
      console.log("Assignment Document updated successfully!");
    } catch (e) {
      console.log("Error updating assignment document:", e);
    }
  } else {
    console.log("No such assignment document!");
  }
}

/***************************************
 * A function to upload the outputData to the "attempts" collection.
 * Additionally, this function sets off checks for if a drill is assigned and
 * if the leaderboard needs to be updated then if the all time record needs to be updated.
 ***************************************/
async function uploadAttempt(
  outputData,
  userId,
  assignedTime,
  drillId,
  drillInfo,
  currentLeaderboard,
  userInfo,
  currentTeamId,
) {
  //create new document
  const newAttemptRef = doc(collection(db, "teams", currentTeamId, "attempts"));

  //Newly created doc Id. Useful for finding upload data in testing.
  console.log("New Attempt Ref ID: ", newAttemptRef.id);

  //add id of new document into the data
  const uploadData = { ...outputData, id: newAttemptRef.id };
  // Upload the data
  await setDoc(newAttemptRef, uploadData);
  console.log("Attempt Document successfully uploaded!");

  await runTransaction(db, async (transaction) => {
    const userRef = doc(db, "teams", currentTeamId, "users", userId);
    const userInfo = await transaction.get(userRef);

    const uniqueDrills = userInfo.data().uniqueDrills;

    if (!uniqueDrills.includes(drillId)) {
      // Add the new item to the array
      transaction.update(userRef, {
        ["uniqueDrills"]: [...uniqueDrills, drillId],
      });
    }
  });

  //Call function to check for leaderboard update
  if (drillInfo.requirements[0].type !== "text") {
    await handleLeaderboardUpdate(
      uploadData,
      drillInfo,
      currentLeaderboard,
      userInfo,
      currentTeamId,
    );
  }

  // Check if drill was assigned
  if (assignedTime) {
    await completeAssigned(
      userId,
      assignedTime,
      drillId,
      newAttemptRef.id,
      currentTeamId,
    );
  }
}

async function uploadTextDrill(userId, assignedTime, drillId, currentTeamId) {
  //create new document
  const newAttemptRef = doc(collection(db, "teams", currentTeamId, "attempts")); //ERROR FROM HERE "indexOf is not a function"

  //Newly created doc Id. Useful for finding upload data in testing.
  console.log("New Attempt Ref ID: ", newAttemptRef.id);

  //add id of new document into the data
  const uploadData = { id: newAttemptRef.id };
  // Upload the data
  await setDoc(newAttemptRef, uploadData);
  console.log("Attempt Document successfully uploaded!");

  await runTransaction(db, async (transaction) => {
    const userRef = doc(db, "teams", currentTeamId, "users", userId);
    const userInfo = await transaction.get(userRef);

    const uniqueDrills = userInfo.data().uniqueDrills;

    if (!uniqueDrills.includes(drillId)) {
      // Add the new item to the array
      transaction.update(userRef, {
        ["uniqueDrills"]: [...uniqueDrills, drillId],
      });
    }
  });

  // Check if drill was assigned
  if (assignedTime) {
    await completeAssigned(
      userId,
      assignedTime,
      drillId,
      newAttemptRef.id,
      currentTeamId,
    );
  }
}

//A function to check leaderboard and update if needed
async function handleLeaderboardUpdate(
  uploadData,
  drillInfo,
  currentLeaderboard,
  userInfo,
  currentTeamId,
) {
  const mainOutputAttempt = drillInfo.mainOutputAttempt;

  //check if the user exists on the leaderboard
  if (currentLeaderboard[uploadData.uid] == undefined) {
    console.log("User not on leaderboard, uploading this attempt");

    await uploadNewLeaderboard(
      mainOutputAttempt,
      uploadData,
      userInfo,
      drillInfo,
      currentTeamId,
    );
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

      await uploadNewLeaderboard(
        mainOutputAttempt,
        uploadData,
        userInfo,
        drillInfo,
        currentTeamId,
      );
    }
  }
}

//A function to update the "best_attempts" collection
async function uploadNewLeaderboard(
  mainOutputAttempt,
  uploadData,
  userInfo,
  drillInfo,
  currentTeamId,
) {
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
    currentTeamId,
    "best_attempts",
    uploadData.did,
  );

  await runTransaction(db, async (transaction) => {
    // get latest leaderboard data again, just in case another player updated best score just now
    const latestLeaderboard = await transaction.get(bestAttemptsDrillRef);
    if (!latestLeaderboard.exists()) {
      const allUserInfo = await getDocs(
        collection(db, "teams", currentTeamId, "users"),
      );
      const emptyBestAttempt = {};
      for (const doc of allUserInfo.docs) {
        emptyBestAttempt[doc.data().uid] = null;
      }

      await transaction.set(bestAttemptsDrillRef, emptyBestAttempt);
    }
    transaction.update(bestAttemptsDrillRef, {
      [uploadData.uid]: newAttempt,
    });
  });
  console.log("Transaction (leaderboard update) successfully committed!");
  await handleRecordUpdate(uploadData, drillInfo, userInfo, currentTeamId);
}

//A function to check if the "all_time_record" collection needs to be updated
async function handleRecordUpdate(
  uploadData,
  drillInfo,
  userInfo,
  currentTeamId,
) {
  const mainOutputAttempt = drillInfo.mainOutputAttempt;

  //Fetch All-time Record
  const recordRef = doc(
    db,
    "teams",
    currentTeamId,
    "all_time_records",
    uploadData.did,
  );

  const docSnap = await getDoc(recordRef);

  const currentRecordInfo = docSnap.data();

  //Check if all time record document exists
  if (!docSnap.exists()) {
    //Empty all time record object
    const newEmptyRecordObject = {
      currentRecord: {},
      previousRecords: [],
    };

    //Create all time record Document
    await setDoc(recordRef, newEmptyRecordObject);

    //Add all time Record
    await uploadNewRecord(uploadData, drillInfo, null, userInfo, currentTeamId);
  } else {
    //Determine if lower is better
    const lowerIsBetter = drillInfo.aggOutputs[mainOutputAttempt].lowerIsBetter;

    //Check if record needs to be updated
    const isNewAttemptBest = lowerIsBetter
      ? uploadData[mainOutputAttempt] < currentRecordInfo.currentRecord["value"]
      : uploadData[mainOutputAttempt] >
        currentRecordInfo.currentRecord["value"];

    if (isNewAttemptBest) {
      //Update record
      await uploadNewRecord(
        uploadData,
        drillInfo,
        currentRecordInfo,
        userInfo,
        currentTeamId,
      );
    }
  }
}

//A function to update the "all_time_record" collection
async function uploadNewRecord(
  uploadData,
  drillInfo,
  currentRecordInfo,
  userInfo,
  currentTeamId,
) {
  const recordRef = doc(
    db,
    "teams",
    currentTeamId,
    "all_time_records",
    uploadData.did,
  );

  const mainOutputAttempt = drillInfo.mainOutputAttempt;

  const distanceMeasure =
    drillInfo.aggOutputs[mainOutputAttempt].distanceMeasure;

  //Create new Record object
  const newRecord = {
    name: userInfo.name,
    value: uploadData[drillInfo.mainOutputAttempt],
    time: uploadData["time"],
    distanceMeasure: distanceMeasure,
  };

  let newDocData;

  //case with no all time record
  if (currentRecordInfo == null) {
    newDocData = {
      currentRecord: newRecord,
      previousRecords: [],
    };
  } else {
    const oldPreviousRecords = currentRecordInfo.previousRecords;

    //add old record to previous records
    const updatedPreviousRecords = [
      ...oldPreviousRecords,
      currentRecordInfo.currentRecord,
    ];

    newDocData = {
      currentRecord: newRecord,
      previousRecords: updatedPreviousRecords,
    };
  }

  //Upload new Document Data
  try {
    await setDoc(recordRef, newDocData);
    console.log("== New Record has been uploaded!");
  } catch (e) {
    console.log(e);
    showDialog("Error", getErrorString(e));
  }
}

/***************************************
 * AttemptShots Generation
 ***************************************/

//A function to generate the shots of a given drill based on it's type
function getShotInfo(drillInfo) {
  let shots = [];
  switch (drillInfo.requirements[0].type) {
    case "random":
      shots = fillRandomShotTargets(drillInfo);
      break;
    case "inputtedPutt":
    case "text":
    case "sequence":
      shots = fillSequentialTargets(drillInfo);
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

//Helper function to generate shots for the sequence drill type
function fillSequentialTargets(drillInfo) {
  const shots = [];
  for (let i = 0; i < drillInfo.reps; i++) {
    shots.push({
      shotNum: i + 1,
      items: {
        [drillInfo.requirements[0].name]: drillInfo.requirements[0].items[i],
      },
    });
  }
  return shots;
}

//Helper function to generate shots for the random drill type
function fillRandomShotTargets(drillInfo) {
  const minCeiled = Math.ceil(drillInfo.requirements[0].min);
  const maxFloored = Math.floor(drillInfo.requirements[0].max);
  const shots = [];

  for (let i = 0; i < drillInfo.reps; i++) {
    const target = Math.floor(
      Math.random() * (maxFloored - minCeiled + 1) + minCeiled,
    );
    let baseline;
    if (drillInfo.shotType === "putt") {
      baseline = lookUpExpectedPutts(target);
    } else {
      baseline = lookUpBaselineStrokesGained(target);
    }
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

//Helper function to generate shots for the putt drill type
function fillPuttTargets(drillInfo) {
  const shots = [];
  for (let i = 0; i < drillInfo.reps; i++) {
    const baseline = lookUpExpectedPutts(drillInfo.requirements[0].items[i]);
    let target = {};
    for (let j = 0; j < drillInfo.requirements.length; j++) {
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
  const carryDiff = calculateCarryDiff(target, carry);
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
  let leftSideLandingTotal = 0;
  let missedLeftShotCount = 0;
  let rightSideLandingTotal = 0;
  let missedRightShotCount = 0;
  let carryDiffTotal = 0;

  const outputShotData = [];

  //Generate the shots array for output data
  for (let j = 0; j < inputValues.length; j++) {
    //Generate the shots array for output data
    const shot = {};
    if (drillInfo.requirements[0].type === "inputtedPutt") {
      attemptShots[j].baseline = lookUpExpectedPutts(inputValues[j].distance);
      attemptShots[j].items.target = inputValues[j].distance;
    }
    for (let i = 0; i < drillInfo.outputs.length; i++) {
      const output = drillInfo.outputs[i];

      switch (output) {
        case "target":
          shot.target = attemptShots[j].items.target;
          break;

        case "distance":
          shot.distance = inputValues[j].distance;
          shot.target =
            attemptShots[j].items.target +
            " " +
            drillInfo.inputs.find(({ id }) => id === output).distanceMeasure;
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

          if (inputValues[j].sideLanding > 0) {
            rightSideLandingTotal += Math.abs(
              Number(inputValues[j].sideLanding),
            );
            missedRightShotCount += 1;
          }
          if (inputValues[j].sideLanding < 0) {
            leftSideLandingTotal += Math.abs(
              Number(inputValues[j].sideLanding),
            );
            missedLeftShotCount += 1;
          }
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

      case "leftSideLandingAverage":
        outputData.leftSideLandingAverage =
          leftSideLandingTotal / missedLeftShotCount;
        break;

      case "rightSideLandingAverage":
        outputData.rightSideLandingAverage =
          rightSideLandingTotal / missedRightShotCount;
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

export default function Input({ setToggleResult, setOutputData }) {
  const { id: drillId, assignedTime } = useLocalSearchParams();
  const { currentUserId, currentTeamId } = useAuthContext();
  const {
    data: currentLeaderboard,
    isLoading: leaderboardIsLoading,
    error: leaderboardError,
  } = useBestAttempts({ drillId });

  const {
    data: drillInfo,
    error: drillInfoError,
    isLoading: drillInfoIsLoading,
  } = useDrillInfo({ drillId });

  const {
    data: userInfo,
    isLoading: userIsLoading,
    error: userError,
  } = useUserInfo({ userId: currentUserId });

  const queryClient = useQueryClient();

  const navigation = useNavigation();

  const invalidateKeys = [
    ["userInfo"], //assignments
    ["best_attempts", { drillId }],
    ["all_time_records", { drillId }],
  ];

  const { height } = useWindowDimensions();

  //a useState hook to track the inputs on each shot
  const [inputValues, setInputValues] = useState([]);

  const [attemptShots, setattemptShots] = useState([]); //a useState hook to hold the requirements of each shot

  const [displayedShot, setDisplayedShot] = useState(0); //a useState hook to track what shot is displayed

  const [currentShot, setCurrentShot] = useState(0); //a useState hook to track current shot to be attempted

  /***** Navigation Bottom Sheet stuff *****/
  const navModalRef = useRef(null);

  /***** Description Bottom Sheet Stuff *****/
  const descriptionModalRef = useRef(null);

  const [snackbarVisible, setSnackbarVisible] = useState(false); // State to toggle snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(""); // State to set snackbar message

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");

  const showDialog = (title, message) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogVisible(true);
  };

  const showSnackBar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  //useEffectHook to set the attempts shot requirements
  useEffect(() => {
    if (drillInfo) {
      setattemptShots(getShotInfo(drillInfo));
      setInputValues(Array.from({ length: drillInfo.reps }, () => ({})));
    }
  }, [drillInfo]);

  const numInputs = drillInfo.inputs.length;

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
  const handleButtonClick = async () => {
    // need to declare userId and drillId like this due to obj destructuring / how query keys are defined in
    // useAttempts / useDrillInfo hooks

    //Check if all inputs have been filled in
    if (
      Object.keys(inputValues[displayedShot]).length !== numInputs ||
      checkEmptyInputs(inputValues[displayedShot])
    ) {
      showSnackBar("All inputs must be filled.");
    }
    //check inputs are all numbers
    else if (validateInputs(inputValues[displayedShot])) {
      showSnackBar("All inputs must be numbers.");
    }
    //check for submit button
    else if (submitVisible) {
      const outputData = createOutputData(
        drillInfo,
        inputValues,
        attemptShots,
        currentUserId,
        drillId,
      );

      setOutputData(outputData);
      try {
        await uploadAttempt(
          outputData,
          currentUserId,
          assignedTime,
          drillId,
          drillInfo,
          currentLeaderboard,
          userInfo,
          currentTeamId,
        );

        // invalidate cache on button press
        await invalidateMultipleKeys(queryClient, invalidateKeys);
        // if there are no errors, go to result screen
        setToggleResult(true);
      } catch (e) {
        console.log(e);
        showDialog("Error", getErrorString(e));
      }
    } else {
      setDisplayedShot(displayedShot + 1);
      setCurrentShot(currentShot + 1);
    }
  };

  //Loading until an attempt is generated or hooks are working
  if (
    leaderboardIsLoading ||
    userIsLoading ||
    drillInfoIsLoading ||
    attemptShots.length === 0
  ) {
    console.log("Loading");
    return <Loading />;
  }

  if (leaderboardError || userError || drillInfoError) {
    return (
      <ErrorComponent message={[leaderboardError, userError, drillInfoError]} />
    );
  }

  return (
    <PaperWrapper>
      <SafeAreaView style={{ height: height }}>
        <GestureHandlerRootView>
          <View style={{ height: "100%" }}>
            <BottomSheetModalProvider>
              <Header
                title={drillInfo.subType}
                subTitle={drillInfo.drillType}
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
                      input={item}
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
                <BottomSheetWrapper ref={navModalRef}>
                  <BottomSheetScrollView
                    contentContainerStyle={{ paddingBottom: 20 }}
                  >
                    <View style={styles.bottomSheetContentContainer}>
                      {attemptShots
                        .slice(0, currentShot + 1)
                        .map((item, id) => (
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
                </BottomSheetWrapper>

                {/* Description Bottom Sheet */}
                <BottomSheetWrapper ref={descriptionModalRef}>
                  <BottomSheetView style={{ paddingBottom: 50 }}>
                    <DrillDescription drillInfo={drillInfo} />
                  </BottomSheetView>
                </BottomSheetWrapper>

                {/* Snackbar Error Dialog */}
                <DialogComponent
                  type={"snackbar"}
                  visible={snackbarVisible}
                  content={snackbarMessage}
                  onHide={() => setSnackbarVisible(false)}
                />

                {/* Generic Error Dialog */}
                <DialogComponent
                  title={dialogTitle}
                  content={dialogMessage}
                  visible={dialogVisible}
                  onHide={() => setDialogVisible(false)}
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
                          case "distance":
                            newInputValues[i][item.id] = Math.floor(
                              Math.random() * 35 + 5,
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
        </GestureHandlerRootView>
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
