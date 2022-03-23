import React from "react";
import {IQueryProviderValuesProps} from "../services/interfaces";

const Context = React.createContext({});

const useQueryContext = () => {
    return React.useContext(Context);
}

interface Props {
    children?: React.ReactNode,
}

const QueryProvider = (props: Props) => {
    const [invalidated, setInvalided] = React.useState<string[]>([]);

    const addKey = (key: string) => {
        setInvalided((p: string[]) => {
            return [...p, key];
        });
    }

    const removeKey = (key: string) => {
        setInvalided((p: string[]) => {
            return p.filter(item => item !== key);
        });
    }

    const providerValues: IQueryProviderValuesProps = {
        addKey,
        removeKey,
        keys: invalidated,
    };

    return (
        <Context.Provider value={providerValues}>
            {props.children}
        </Context.Provider>
    );
}

export {
    QueryProvider,
    useQueryContext
}
