import {ICreateControllerParams} from "./interfaces";

const createClientController = ({client}: ICreateControllerParams) => {

    const calls: any = {};

    const cancelPreviousCall = (url: string): void => {
        if (!calls.hasOwnProperty(url)) return;
        const source = calls[url];
        if (typeof source !== typeof undefined)
            source.cancel("Operation canceled due to new request.");
    }

    const removeSource = (url: string): void => {
        delete calls[url];
    }

    const createSource = (url: string): void => {
        if (client?.CancelToken?.source)
            calls[url] = client?.CancelToken?.source();
    }

    const getSource = (url: string): any => {
        return calls[url];
    }

    return {
        calls,
        getSource,
        removeSource,
        createSource,
        cancelPreviousCall
    }
}

export default createClientController;
