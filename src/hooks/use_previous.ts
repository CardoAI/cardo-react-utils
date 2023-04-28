import { useRef, useEffect, MutableRefObject } from 'react';

export const usePrevious = <T>(value: T, initialValue?: any) => {
  const ref: MutableRefObject<T> = useRef<T>(initialValue);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export default usePrevious;
