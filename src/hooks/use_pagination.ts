import React from "react";

function usePagination(defaultValue: number = 1, length?: number) {
  const [page, setPage] = React.useState<number>(defaultValue);

  const isMax = (): boolean => {
    return !!length && page >= length;
  }

  const isMin = (): boolean => {
    return page <= 1;
  }

  const onToNextPage = (): void => {
    if (isMax()) return;
    setPage(prev =>  prev +1);
  };

  const onToPreviousPage = (): void => {
    if (isMin()) return;
    setPage(prev =>  prev - 1);
  };

  const handlePage = (value: number): void => {
    if (isMax() || isMin()) return;
    setPage(value);
  };

  const resetPage = (): void => {
    setPage(defaultValue);
  }

  return {
    page,
    setPage,
    resetPage,
    handlePage,
    onToNextPage,
    onToPreviousPage,
  }
}

export default usePagination;
