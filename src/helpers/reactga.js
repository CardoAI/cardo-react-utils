import ReactGA from "react-ga";

export const dispatchGAEvent = (eventConfiguration) => {
  return ReactGA.event(eventConfiguration);
};