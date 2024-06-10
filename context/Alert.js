import { createContext, useContext } from "react";

export const AlertContext = createContext({
  showDialog: () => {},
  showSnackBar: () => {},
});

export const useAlertContext = () => {
  return useContext(AlertContext);
};
