import React from "react";

const useBoolean = (initialState: boolean = false) => {
  const [active, setActive] = React.useState<boolean>(initialState);

  const toggle = (): void => {
    setActive(prev => !prev);
  };

  const enable = (): void => {
    setActive(true);
  };

  const disable = (): void => {
    setActive(false);
  };

  return {
    active,
    setActive,
    enable,
    disable,
    toggle,
  };
}

export default useBoolean;
