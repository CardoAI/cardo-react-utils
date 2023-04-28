import React from 'react';

export const useDidMount = (fn: any) => {
  React.useEffect(() => {
    fn();
  }, []);
};

export default useDidMount;