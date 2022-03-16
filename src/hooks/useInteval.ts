import {useEffect, useLayoutEffect, useRef} from 'react'

export const useInterval = (callback: any, delay: number) => {
  const savedCallback = useRef(callback)

  useLayoutEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {

    if (!delay)
      return

    const id = setInterval(() => savedCallback.current(), delay)

    return () => clearInterval(id)
  }, [delay])
}

export default useInterval;
