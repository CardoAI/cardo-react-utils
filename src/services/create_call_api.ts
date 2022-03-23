import {AxiosError, AxiosResponse} from "axios";
import {ICreateCallApiProps, ICreateUseQuery, IOptions} from "./interfaces";

const getOptions = (url: string, method: string, dataType: string, body: any, baseURL: string | undefined, source: any): IOptions => {
    const options: IOptions = {
        url: url,
        method: method,
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}
    };
    if (dataType === 'form') options.headers['Content-Type'] = "multipart/form-data";
    if (body) options.data = body;
    if (baseURL) options.baseURL = baseURL;
    if (source) options.cancelToken = source.token;
    return options;
}

const cancelPreviousCallsFn = (controller: any, baseUrl: string): void => {
    controller.cancelPreviousCall(baseUrl);
    controller.removeSource(baseUrl);
    controller.createSource(baseUrl);
}

const loadFromCache = (key: string, cache: any): any => {
    if (cache.includes(key)) return cache.get(key);
    return undefined;
}
const storeToCache = (key: string, value: any, cache: any): void => {
    cache.set(key, value);
}

const getErrorMessagesFromObject = (data: any) => {
    const messages: any[] = [];

    const addErrorMessage = (key: string, value: any) => {
        messages.push(`${key}: ${value}`);
    }
    const addErrorMessages = (key: string, messageList: any) => {
        messageList.forEach((m: any) => addErrorMessage(key, m));
    }

    Object.entries(data).forEach(([key, value]: any) => {
        if (typeof value === 'string') addErrorMessage(key, value);
        else if (Array.isArray(value)) addErrorMessages(key, value);
        else if (typeof value === 'object') {
            Object.entries(value).forEach(([innerKey, innerValue]: any) => addErrorMessages(innerKey, innerValue));
        }
    });

    return messages;
}

export default ({client, cache, controller, notification, baseURL}: ICreateUseQuery) =>
    ({
         url,
         body,
         successMessage,
         method = "get",
         dataType = "json",
         useCache = true,
         useCacheOnly = false,
         cancelPreviousCalls = false,
         invalidDataMessage = "Invalid Data",
         setLoading, onSuccess, onError, onFinish,
         errorMessage = "An error happened. Please Try Again!",
         canDisplayError,
     }: ICreateCallApiProps) => {

        const canUseCache: boolean = (method === 'get' && useCache && cache !== undefined);

        const previous: any = canUseCache ? loadFromCache(url, cache) : undefined;

        if (previous) {
            if (useCacheOnly) return;
            if (onSuccess) onSuccess(previous)
        }

        const baseUrl = url.split('?')[0];
        if (cancelPreviousCalls) cancelPreviousCallsFn(controller, baseUrl);
        if (setLoading) setLoading(true);
        const source: any = controller.getSource(baseUrl);
        const options: IOptions = getOptions(url, method, dataType, body, baseURL, source);

        return client(options).then((response: AxiosResponse) => {
            if (successMessage) notification.success(successMessage);
            if (onSuccess) onSuccess(response);
            if (canUseCache) storeToCache(url, response, cache);
            return response;
        }).catch((error: AxiosError) => {
            if (error.response) {
                const {status, data} = error.response;
                if (onError) onError(error.response);

                if (canDisplayError && !canDisplayError(status)) return;

                if (status === 500) {
                    notification.error(errorMessage);
                }
                    // else if (status === 403) {
                    //   notification.forbidden();
                // }
                else if (status === 400) {
                    let errors: any = "";

                    if (Array.isArray(data)) data.forEach(message => errors += `${message}\n`);
                    else if (typeof data === 'object') errors = getErrorMessagesFromObject(data);

                    if (Array.isArray(errors)) errors.forEach(error => notification.warning(error, invalidDataMessage));
                    else notification.warning(errors, invalidDataMessage);

                } else if (status.toString().startsWith("4")) {
                    if (data.message) notification.warning(data.message);
                } else {
                    notification.error(errorMessage);
                }
            }
        }).finally(() => {
            if (setLoading) setLoading(false);
            if (onFinish) onFinish();
        });
    }
