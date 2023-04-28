import React from "react";

const clone = (obj: any) => {
  return { ...obj };
}

const useStateObject = (initialState: any): any => {
  const [state, setState] = React.useState<any>(initialState);

  const reset = () => {
    setState({});
  }

  const get = (key: any) => {
    return state[key];
  }

  const setField = (key: string, value: any) => {
    setState((prev: any) => {
      const result = clone(prev);
      result[key] = value;
      return result;
    });
  }

  const remove = (name: string) => {
    setState((prev: any) => {
      const result = clone(prev);
      delete result[name];
      return result;
    });
  }

  const clearField = (name: string) => {
    setField(name, undefined);
  }

  const update = (changes: any) => {
    setState((previous: any) => {
      const updates = clone(previous);

      if (Array.isArray(changes))
        changes.forEach((change: any) => updates[change.key] = change.value);
      else
        updates[changes.key] = changes.value;

      return updates;
    });
  }

  // @ts-ignore
  const bulkUpdate = (changes: any) => {
    setState((prev: any) => ({ ...prev, ...changes }));
  }

  // @ts-ignore
  const imperativeUpdate = (updateFn: (state: any) => void) => {
    setState((prev: any) => {
      const result = clone(prev);
      updateFn(result);
      return result;
    });
  }

  return {
    get: get,
    state: state,
    reset: reset,
    set: setState,
    update: update,
    delete: remove,
    clearField: clearField,
  }
}

export default useStateObject;
