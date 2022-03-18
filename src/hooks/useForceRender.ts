import React from "react";

export const useForceRender = () => {
  const [, setTick] = React.useState<boolean>(true);

  return React.useCallback(() => {
    setTick((v: boolean) => !v);
  }, []);

};

export default useForceRender;