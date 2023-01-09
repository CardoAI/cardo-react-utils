import React from "react";

interface EventParam {
  type: string,
  param?: any,
}

const eventSystem = () => {
  let handlers: ((eventParam: EventParam) => void)[] = [];

  const add = (handler: (eventParam: EventParam) => void) => {
    handlers.push(handler);
  }

  const remove = (handler: (eventParam: EventParam) => void) => {
    handlers = handlers.filter(h => h !== handler);
  }

  const fire = (eventParam: EventParam) => {
    for (const handler of handlers)
      handler(eventParam);
  }

  return { add, remove, fire };
}

const _eventService = eventSystem();

const useMessageEvent = (type: string, handler: (param?: any) => void) => {
  React.useEffect(() => {
    const eventHandler = (e: EventParam) => {
      if (e.type !== type) return;
      handler(e.param);
    }
    _eventService.add(eventHandler);
    return () => _eventService.remove(eventHandler);
  }, []);
}

const dispatchMessage = (type: string, param?: any) => {
  _eventService.fire({ type, param });
}

const MessageEvent = { useMessageEvent, dispatchMessage };

export default MessageEvent;
