import { useRef, useEffect, MutableRefObject } from 'react';

export const usePrevious = (value: any) => {
  const ref: MutableRefObject<any> = useRef<any>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export default usePrevious;
