import React from "react";

export const useForceRender = () => {
  const [, setTick] = React.useState(true);

  return React.useCallback(() => {
    setTick((v) => !v);
  }, []);

};

export default useForceRender;