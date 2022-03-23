import {AxiosInstance} from "axios";

interface ErrorInterceptorParams {
  client: AxiosInstance,
  forceLogout: () => void,
  refreshToken: () => Promise<any>,
  setToken: (token: string) => void,
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

const createInterceptor = ({client, forceLogout, refreshToken, setToken}: ErrorInterceptorParams) => {

  let failedRequests: any[] = [];
  let refreshingToken = false;

  const processQueue = (error: any, token = null) => {
    failedRequests.forEach(promise => {
      if (error) promise.reject(error);
      else promise.resolve(token);
    });
    failedRequests = [];
  };

  return client.interceptors.response.use(undefined, (error: any) => {

    if (error.response.status === 403) forceLogout();
    if (!shouldIntercept(error)) return Promise.reject(error);
    if (error.config._retry || error.config._queued) return Promise.reject(error);

    const originalRequest = error.config;

    if (refreshingToken) {
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
    refreshingToken = true;

    return new Promise((resolve, reject) => {
      refreshToken().then((response: any) => {
        const token = response.data.access;
        setToken(token);
        attachTokenToRequest(originalRequest, token);
        processQueue(null, token);
        resolve(client.request(originalRequest));
      }).catch((err: any) => {
        reject(err);
        forceLogout();
      }).finally(() => {
        refreshingToken = false;
      });
    });
  });
}

export default createInterceptor;
