import {AxiosInstance} from "axios";

interface ErrorInterceptorParams {
    client: AxiosInstance,
    onSessionEnd: () => void,
    updateSession: () => Promise<any>,
    onSessionUpdate: (token: string) => void,
}

const attachTokenToRequest = (request: any, token: any) => {
    if (token)
        request.headers['Authorization'] = 'Bearer ' + token;
};

const shouldIntercept = (error: any) => {
    try {
        return [401, 419].includes(error.response.status);
    } catch (e) {
        return false;
    }
};

const createInterceptor = ({client, updateSession, onSessionUpdate, onSessionEnd}: ErrorInterceptorParams) => {
    let loadingSession = false, failedRequests: any[] = [];

    const processQueue = (error: any, token = null) => {
        failedRequests.forEach(promise => {
            if (error) promise.reject(error);
            else promise.resolve(token);
        });
        failedRequests = [];
    };

    return client.interceptors.response.use(undefined, (error: any) => {

        if (!shouldIntercept(error)) return Promise.reject(error);

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
            updateSession().then((response: any) => {
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
    });
}

export default createInterceptor;
