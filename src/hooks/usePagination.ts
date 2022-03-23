import React from "react";

function usePagination(defaultValue = 1) {

    const [page, setPage] = React.useState<number>(defaultValue);

    const onToNextPage = (): void => {
        setPage(page + 1);
    };

    const onToPreviousPage = (): void => {
        setPage(page - 1);
    };

    const handlePage = (value: number) => {
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

export default usePagination