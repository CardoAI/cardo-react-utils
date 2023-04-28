import React from "react";

export const useToggle = (initialState: boolean = false): [boolean, (() => void)] => {
  const [state, setState] = React.useState<boolean>(initialState);

  const toggle = React.useCallback((): void => {
    setState(state => !state)
  }, []);

  const open = React.useCallback(() => {
    setState(true);
  }, []);

  const close = React.useCallback(() => {
    setState(false);
  }, []);

  return [state, toggle];
}
