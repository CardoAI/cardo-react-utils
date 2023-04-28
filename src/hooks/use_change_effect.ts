import React from "react";
import { usePrevious } from "./index";

const useChangeEffect = <T>(value: T, callback: (previous: T | undefined, current: T) => void) => {
  const previous = usePrevious(value);

  React.useEffect(() => {
    if (value !== previous) {
      callback(previous, value);
    }
  }, [value, previous, callback]);
}

export default useChangeEffect;
