import { createContext } from "react";

export const CurrentUserContext = createContext({
  userId: "c0nEyjaOMhItMQTLMY0X",
  teamId: "1",
  updateCurrentUser: () => {},
  updateCurrentTeam: () => {},
});
