import React from "react";

const useHover = <T>(): [React.MutableRefObject<T>, boolean] => {
  const [value, setValue] = React.useState<boolean>(false);
  const ref: any = React.useRef<T | null>(null);

  const handleMouseOver = (): void => setValue(true);
  const handleMouseOut = (): void => setValue(false);

  React.useEffect(
    (): any => {
      const node: any = ref.current;
      if (node) {
        node.addEventListener("mouseover", handleMouseOver);
        node.addEventListener("mouseout", handleMouseOut);
        return () => {
          node.removeEventListener("mouseover", handleMouseOver);
          node.removeEventListener("mouseout", handleMouseOut);
        };
      }
    },
    [ref.current] // Recall only if ref changes
  );

  return [ref, value];
}

export default useHover;