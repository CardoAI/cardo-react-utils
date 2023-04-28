import React from "react";

export const useDidUpdate = (fn: any, deps?: React.DependencyList) => {
  const firstRunRef = React.useRef<boolean>(true);

  React.useEffect(() => {
    if (firstRunRef.current) firstRunRef.current = false;
    else fn();
  }, deps);
};

export default useDidUpdate;
