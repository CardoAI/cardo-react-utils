import React from "react";

const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = React.useState<any>(value);

  React.useEffect(
    () => {
      const callback = () => setDebouncedValue(value);
      const handler = setTimeout(callback, delay);
      return () => clearTimeout(handler);
    },
    [value, delay]
  );

  return debouncedValue;
}

export default useDebounce;
