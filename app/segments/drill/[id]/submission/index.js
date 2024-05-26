import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { DefaultTheme, PaperProvider } from "react-native-paper";

import Input from "./input";
import Result from "./result";

import DialogComponent from "~/components/dialog";

export default function Index() {
  const [outputData, setOutputData] = useState([]);
  const [toggleResult, setToggleResult] = useState(false);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const hideLeaveDialog = () => setDialogVisible(false);

  const [exitAction, setExitAction] = useState(null);
  // Navigation
  const navigation = useNavigation();

  const showDialog = (title, message) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogVisible(true);
  };

  useEffect(() => {
    navigation.setOptions({ gestureEnabled: toggleResult });
  }, [toggleResult]);

  useEffect(() => {
    return navigation.addListener("beforeRemove", (e) => {
      if (toggleResult) {
        return;
      }
      // Prevent default behavior of leaving the screen
      e.preventDefault();

      setExitAction(e.data.action);

      // Prompt the user before leaving the screen
      showDialog("Alert", "All inputs will be lost.");
    });
  }, [toggleResult]);

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
        title={dialogTitle}
        content={dialogMessage}
        visible={dialogVisible}
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
