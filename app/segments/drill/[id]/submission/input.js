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
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import DrillInput from "~/components/input/drillInput";
import DrillTarget from "~/components/input/drillTarget";
import NavigationRectange from "~/components/input/navigationRectange";
import { SafeAreaView } from "react-native-safe-area-context";

import { AttemptData } from "~/testData";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Description from "./modals/description";

export default function Input({ inputValues, setInputValues }) {
  //Helper varibles
  const numInputs = AttemptData.shots[0].inputs.length;

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
          onPress={() =>
            router.replace(`/segments/drill/${id}/submission/result`)
          }
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
                  Shot {AttemptData.shots[shotIndex].shotNum}
                  <Text style={styles.shotTotal}>
                    /{AttemptData.shots.length}
                  </Text>
                </Text>
              </View>

              <View style={styles.container}>
                {/* Instruction */}

                <View style={styles.horizontalContainer}>
                  {AttemptData.shots[shotIndex].target.map((item, id) => (
                    <DrillTarget
                      key={id}
                      description={item.description}
                      distanceMeasure={item.distanceMeasure}
                      value={item.value}
                    />
                  ))}
                </View>

                {/* Inputs */}

                {AttemptData.shots[shotIndex].inputs.map((item, id) => (
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
                    for (let i = 0; i < AttemptData.shots.length; i++) {
                      console.log("InputValue[", i, "]: ", inputValues[i]);
                    }
                    console.log(inputValues);
                  }}
                >
                  Log Input State Status
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
                    {AttemptData.shots.map((item, id) => (
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
                          inputs={item.inputs}
                          target={item.target}
                          inputValues={inputValues[id]}
                          shotIndex={item.shotNum}
                          numShots={AttemptData.shots.length}
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
