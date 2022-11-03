import React from "react";

const eventSystem = () => {
  let handlers: ((eventParam?: any) => void)[] = [];

  const add = (handler: (eventParam?: any) => void) => {
    handlers.push(handler);
  }

  const remove = (handler: (eventParam?: any) => void) => {
    handlers = handlers.filter(h => h !== handler);
  }

  const fire = (eventParam?: any) => {
    for (const handler of handlers)
      handler(eventParam);
  }

  return { add, remove, fire };
}

const _eventService = eventSystem();

const useMessageEvent = (handler: (eventParam?: any) => void) => {
  React.useEffect(() => {
    _eventService.add(handler);
    return () => _eventService.remove(handler);
  }, []);
}

const dispatchMessage = (eventParam?: any) => {
  _eventService.fire(eventParam);
}

const MessageEvent = { useMessageEvent, dispatchMessage };

export default MessageEvent;
