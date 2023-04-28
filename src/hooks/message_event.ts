import React from "react";

interface EventParam {
  type: string,
  param?: any,
}

const eventSystem = () => {
  let handlers: ((eventParam: EventParam) => void)[] = [];

  const subscribe = (handler: (eventParam: EventParam) => void) => {
    handlers.push(handler);
    return () => {
      handlers = handlers.filter(h => h !== handler);
    };
  }

  const fire = (eventParam: EventParam) => {
    for (const handler of handlers)
      handler(eventParam);
  }

  return { subscribe, fire };
}

const _eventService = eventSystem();

const useMessageEvent = (type: string, handler: (param?: any) => void) => {
  React.useEffect(() => {
    return _eventService.subscribe((e: EventParam): void => {
      if (e.type !== type) return;
      handler(e.param);
    });
  }, []);
}

const dispatchMessage = (type: string, param?: any) => {
  _eventService.fire({ type, param });
}

const MessageEvent = { useMessageEvent, dispatchMessage };

export default MessageEvent;
