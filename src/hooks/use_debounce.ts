import { useState } from "react";

const useDebounce = () => {
  const [intervalId, setIntervalId] = useState<any>(null);

  return (func: any, wait: number) => {
    if (intervalId) clearTimeout(intervalId);
    setIntervalId(setTimeout(func, wait));
  };
};

export default useDebounce;
