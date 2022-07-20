import { AxiosInstance } from "axios";

enum ERROR_CODES {
    INVALID_REQUEST = 400,
    TOKEN_ERROR = 401,
    SESSION_EXPIRED = 419,
    TOO_MANY_ATTEMPTS = 429,
}

interface ExtendedAxiosInstance extends AxiosInstance {
    isCancel?: (param: any) => boolean
}

interface ErrorInterceptorParams {
    client: ExtendedAxiosInstance,
    onSessionEnd: () => void,
    refreshSession: () => Promise<any>,
    onSessionUpdate: (token: string) => void,
    notification: any,
    defaultErrorMessage?: string,
}

const attachTokenToRequest = (request: any, token: any) => {
    if (token) request.headers['Authorization'] = 'Bearer ' + token;
};

const isTokenError = (error: any): boolean => {
    try {
        return [ERROR_CODES.TOKEN_ERROR, ERROR_CODES.SESSION_EXPIRED].includes(error.response.status);
    } catch (e) {
        return false;
    }
};

const isClientError = (error: any): boolean => {
    try {
        return String(error.response.status).startsWith('4');
    } catch (e) {
        return false;
    }
}

const displayErrorMessagesFromArray = (data: any[], notification: any): void => {
    let errors: string = '';
    data.forEach((message: any) => errors += `${message}\n`);
    notification.warning(errors);
}

const displayErrorMessagesFromObject = (data: any, notification: any): void => {
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

    messages.forEach(error => notification.warning(error));
}

const showClientError = (error: any, notification: any) => {
    const { status, data } = error.response;
    if (status === ERROR_CODES.INVALID_REQUEST) {
        if (Array.isArray(data))
            displayErrorMessagesFromArray(data, notification);
        else if (typeof data === 'object')
            displayErrorMessagesFromObject(data, notification);
    } else if (status === ERROR_CODES.TOO_MANY_ATTEMPTS) {
        notification.error("Too many attempts. Try again later");
    } else {
        if (data.message) notification.warning(data.message);
        if (data.detail) notification.warning(data.detail);
    }
}

const createInterceptor = ({
                               client,
                               refreshSession,
                               onSessionUpdate,
                               onSessionEnd,
                               notification,
                               defaultErrorMessage = 'An error happened. Please Try Again!',
                           }: ErrorInterceptorParams) => {

    let loadingSession = false, failedRequests: any[] = [];

    const processQueue = (error: any, token = null) => {
        failedRequests.forEach(promise => {
            if (error) promise.reject(error);
            else promise.resolve(token);
        });
        failedRequests = [];
    };

    return client.interceptors.response.use(undefined, (error: any) => {

        if (!!client.isCancel && client.isCancel(error)) return;

        if (isTokenError(error)) {
            if (error.config._retry || error.config._queued) return Promise.reject(error);

            const originalRequest = error.config;

            if (loadingSession) {
                return new Promise(function (resolve, reject) {
                    failedRequests.push({resolve, reject});
                }).then(token => {
                    originalRequest._queued = true;
                    attachTokenToRequest(originalRequest, token);
                    return client.request(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            loadingSession = true;

            return new Promise((resolve, reject) => {
                refreshSession().then((response: any) => {
                    const token = response.data.access;
                    onSessionUpdate(token);
                    attachTokenToRequest(originalRequest, token);
                    processQueue(null, token);
                    resolve(client.request(originalRequest));
                }).catch((err: any) => {
                    reject(err);
                    onSessionEnd();
                }).finally(() => {
                    loadingSession = false;
                });
            });
        }

        else if (isClientError(error)) showClientError(error, notification);

        else notification.error(defaultErrorMessage);

        return Promise.reject(error);
    });
}

export default createInterceptor;
