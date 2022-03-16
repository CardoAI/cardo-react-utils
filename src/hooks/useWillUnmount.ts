import React from 'react';

export const useWillUnmount = (fn: any) => {
  React.useEffect(() => {
    return () => {
      fn();
    };
  }, []);
};

export default useWillUnmount;