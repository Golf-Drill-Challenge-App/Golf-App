import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { DefaultTheme, PaperProvider } from "react-native-paper";

import Input from "./input";
import Result from "./result";

import DialogComponent from "~/components/dialog";

export default function Index() {
  const [outputData, setOutputData] = useState([]);
  const [toggleResult, setToggleResult] = useState(false);
  const [leaveDialogVisible, setLeaveDialogVisible] = useState(false);
  const hideLeaveDialog = () => setLeaveDialogVisible(false);

  const [exitAction, setExitAction] = useState(null);
  // Navigation
  const navigation = useNavigation();

  const showDialog = () => {
    setLeaveDialogVisible(true);
  };

  useEffect(() => {
    navigation.setOptions({ gestureEnabled: toggleResult });
  }, [navigation, toggleResult]);

  useEffect(() => {
    return navigation.addListener("beforeRemove", (e) => {
      if (toggleResult) {
        return;
      }
      // Prevent default behavior of leaving the screen
      e.preventDefault();

      setExitAction(e.data.action);

      // Prompt the user before leaving the screen
      showDialog();
    });
  }, [navigation, toggleResult]);

  const display = () => {
    if (toggleResult) {
      return (
        <Result submission={outputData} setToggleResult={setToggleResult} />
      );
    } else {
      return (
        <Input
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
        content={"All inputs will be lost."}
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
