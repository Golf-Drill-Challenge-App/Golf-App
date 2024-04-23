import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { DefaultTheme, PaperProvider } from "react-native-paper";

import Loading from "~/components/loading";
import Input from "./input";
import Result from "./result";

import ErrorComponent from "~/components/errorComponent";
import { useDrillInfo } from "~/hooks/useDrillInfo";
import DialogComponent from "../../../../../components/dialog";

export default function Index() {
  const { id } = useLocalSearchParams();

  const [outputData, setOutputData] = useState([]);
  const [toggleResult, setToggleResult] = useState(false);
  const [leaveDialogVisible, setLeaveDialogVisible] = useState(false);
  const hideLeaveDialog = () => setLeaveDialogVisible(false);

  const [exitAction, setExitAction] = useState(null);
  // Navigation
  const navigation = useNavigation();

  navigation.setOptions({ gestureEnabled: toggleResult });
  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        if (toggleResult) {
          return;
        }
        // Prevent default behavior of leaving the screen
        e.preventDefault();

        setExitAction(e.data.action);

        // Prompt the user before leaving the screen
        setLeaveDialogVisible(true);
      }),
    [navigation, toggleResult],
  );

  const {
    data: drillInfo,
    error: drillInfoError,
    isLoading: drillInfoIsLoading,
  } = useDrillInfo(id);

  if (drillInfoIsLoading) return <Loading />;

  if (drillInfoError) return <ErrorComponent error={drillInfoError.message} />;

  const display = () => {
    if (toggleResult) {
      return (
        <Result
          submission={outputData}
          drillInfo={drillInfo}
          setToggleResult={setToggleResult}
        />
      );
    } else {
      return (
        <Input
          drillInfo={drillInfo}
          setToggleResult={setToggleResult}
          setOutputData={setOutputData}
        />
      );
    }
  };

  return (
    <PaperProvider theme={DefaultTheme}>
      {display()}

      {/* Leave Drill Dialog */}
      <DialogComponent
        title={"Alert"}
        content="All inputs will be lost."
        visible={leaveDialogVisible}
        onHide={hideLeaveDialog}
        buttons={["Cancel", "Leave Drill"]}
        buttonsFunctions={[
          hideLeaveDialog,
          () => {
            hideLeaveDialog();
            navigation.dispatch(exitAction);
          },
        ]}
      />
    </PaperProvider>
  );
}
