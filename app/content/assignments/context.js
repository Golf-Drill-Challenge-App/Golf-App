import { createContext, useState } from "react";

// Create the context
export const PlayerContext = createContext();

// Create a provider component
export const PlayerProvider = ({ children }) => {
  const [playerList, setPlayerList] = useState([]);

  return (
    <PlayerContext.Provider value={{ playerList, setPlayerList }}>
      {children}
    </PlayerContext.Provider>
  );
};
