import React from 'react';
import useDidMount from "./useDidMount";
import useDidUpdate from "./useDidUpdate";
import useWillUnmount from "./useWillUnmount";

//#region TYPES

enum ADD_TO_MEDIATOR_RESULT {
  TAKEN,
  SUCCESS,
}

interface MediatorComponent {
  [p: string]: any,
}

interface IMediator {
  [p: string]: MediatorComponent,
}

//#endregion

const eventSystem = () => {
  let handlers: ((key: string) => void)[] = [];

  const add = (handler: (key: string) => void) => {
    handlers.push(handler);
  }

  const remove = (handler: (key: string) => void) => {
    handlers = handlers.filter(h => h !== handler);
  }

  const fire = (key: string) => {
    for (const handler of handlers)
      handler(key);
  }

  return { add, remove, fire };
}

const mediator = () => {
  const registeredComponents: IMediator = {};

  const read = (key: string): any => {
    return registeredComponents[key];
  }

  const add = (key: string, value: any): ADD_TO_MEDIATOR_RESULT => {
    if (!!registeredComponents[key])
      return ADD_TO_MEDIATOR_RESULT.TAKEN;

    registeredComponents[key] = value;

    return ADD_TO_MEDIATOR_RESULT.SUCCESS;
  }

  const update = (key: string, value: any): void => {
    registeredComponents[key] = value;
  }

  const remove = (key: string): void => {
    if (!registeredComponents[key]) return;
    delete registeredComponents[key];
  }

  return { read, add, update, remove };
}

const _mediatorService = mediator();
const _eventService = eventSystem();

const useRegister = (key: string, valueFn: () => any, deps: any[]) => {
  const keyRef = React.useRef<string>(key);
  const isKeyTakenRef = React.useRef(false);

  const componentKey: string = keyRef.current;

  useDidMount(() => {
    const result: ADD_TO_MEDIATOR_RESULT = _mediatorService.add(componentKey, valueFn());

    if (result === ADD_TO_MEDIATOR_RESULT.TAKEN) {
      isKeyTakenRef.current = true;
      console.error(`Tried to register a component with key '${componentKey}' which already exists on the mediator!`);
      return;
    }

    _eventService.fire(componentKey);
  });

  useDidUpdate(() => {
    if (isKeyTakenRef.current) return;
    _mediatorService.update(componentKey, valueFn());
    _eventService.fire(componentKey);
  }, deps);

  useWillUnmount(() => {
    if (isKeyTakenRef.current) return;
    _mediatorService.remove(componentKey);
  });
}

const useConsume = (key: string) => {
  const keyRef = React.useRef<string>(key);
  const targetComponentKey: string = keyRef.current;

  const [component, setComponent] = React.useState<MediatorComponent>(() => {
    return _mediatorService.read(targetComponentKey);
  });

  React.useEffect(() => {
    const handler = (updatedComponentKey: string) => {
      if (updatedComponentKey !== targetComponentKey) return;
      setComponent(_mediatorService.read(targetComponentKey));
    }
    _eventService.add(handler);
    return () => _eventService.remove(handler);
  }, []);

  return component;
}

const Mediator = { useRegister, useConsume };

export default Mediator;
