import { createContext, useContext, useState } from "react";
import DialogComponent from "~/components/dialog";

export const AlertContext = createContext({
  showDialog: () => {},
  showSnackBar: () => {},
});

export const useAlertContext = () => {
  return useContext(AlertContext);
};

export const AlertProvider = ({ children }) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  return (
    <AlertContext.Provider
      value={{
        showDialog: (title, message) => {
          if (title === "Error" && message === "permission-denied") return; //for initial sign in. do this or change the rules
          setDialogTitle(title);
          setDialogMessage(message);
          setDialogVisible(true);
        },
        showSnackBar: (message) => {
          setSnackbarMessage(message);
          setSnackbarVisible(true);
        },
      }}
    >
      {/* Generic Error dialog */}
      <DialogComponent
        title={dialogTitle}
        content={dialogMessage}
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
      />

      {/* Snackbar Error Dialog */}
      <DialogComponent
        type={"snackbar"}
        visible={snackbarVisible}
        content={snackbarMessage}
        onHide={() => setSnackbarVisible(false)}
      />
      {children}
    </AlertContext.Provider>
  );
};
