import { startOfDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { createContext, useContext, useState } from "react";

export const TimeContext = createContext({
  timeZone: "",
  setTimeZone: () => {},
  getLocalizedDate: () => {},
  getCurrentLocalizedDate: () => {},
});

export const useTimeContext = () => {
  return useContext(TimeContext);
};

export const TimeProvider = ({ children }) => {
  const [timeZone, setTimeZone] = useState("America/Los_Angeles");

  const validateTime = (time) => {
    let returnedTime = time;
    if (typeof time === "string") {
      const temp = parseInt(time, 10);
      if (!isNaN(temp)) {
        returnedTime = temp;
      }
    }
    return returnedTime;
  };

  return (
    <TimeContext.Provider
      value={{
        timeZone,
        setTimeZone: (timezone) => {
          setTimeZone(timezone);
        },
        getLocalizedDate: ({ time, rounded = false }) => {
          const zonedTime = toZonedTime(validateTime(time), timeZone);
          return rounded ? startOfDay(zonedTime) : zonedTime;
        },
        getCurrentLocalizedDate: ({ rounded = false }) => {
          const currentTime = new Date();
          const zonedTime = toZonedTime(currentTime, timeZone);
          return rounded ? startOfDay(zonedTime) : zonedTime;
        },
      }}
    >
      {children}
    </TimeContext.Provider>
  );
};
