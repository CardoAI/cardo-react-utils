import React from 'react';

const registeredComponents: any = {};

export const useMediator = (key: string, value: any) => {
  React.useEffect(() => {
    if (registeredComponents[key]) {
      console.error(`Component with key '${key}' is already registered on the mediator!`);
      return;
    }
    registeredComponents[key] = value;
    return () => { delete registeredComponents[key]; }
  }, []);
}

export const mediatorSend = (componentKey: string, actionName: string, actionParams: any) => {
  const component = registeredComponents[componentKey];
  if (component === undefined) {
    console.error(`The mediator does not contain a component with key '${componentKey}'!`);
    return;
  }
  const componentAction = component[actionName];
  if (typeof componentAction !== 'function' ) {
    console.error(`The component with key '${componentKey}' does not contain a function named '${actionName}'!`);
    return;
  }
  actionParams !== undefined ? componentAction(actionParams) : componentAction();
}
