import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import {ICreateClient, IClient} from "../interfaces";

const createClient = ({baseUrl, forceLogout, getToken, refreshToken}: ICreateClient) :IClient=> {

  let failedRequests: Array<{ resolve: (param?: any) => void, reject: (param?: any) => void }> = [];
  let refreshingToken: boolean = false;

  const client: IClient = axios.create({baseURL: baseUrl});

  const shouldIntercept = (error: AxiosError): boolean => {
    if (error.response?.status)
      return [401, 419].includes(error.response.status)

    return false;
  }

  const attachParamsToRequest = (request: AxiosRequestConfig, token: string | any): void => {
    if (token)
      request.headers['Authorization'] = 'Bearer ' + token;
  };

  const processQueue = (error: AxiosError | null, token: string | null = null): void => {
    failedRequests.forEach((promise) => {
      if (error)
        promise.reject(error);
      else
        promise.resolve(token);
    });
    failedRequests = [];
  };

  const onRequestStart = (request: AxiosRequestConfig): AxiosRequestConfig => {
    const token = getToken();
    attachParamsToRequest(request, token)
    return request;
  }

  const onRequestFailure = (error: any): Promise<any> => {

    if (!shouldIntercept(error))
      return Promise.reject(error);

    if (error.config._retry || error.config._queued)
      return Promise.reject(error);

    const originalRequest = error.config;

    if (refreshingToken) {
      return new Promise(function (resolve, reject) {
        failedRequests.push({resolve, reject})
      }).then((token: AxiosResponse | string | any) => {
        originalRequest._queued = true;
        attachParamsToRequest(originalRequest, token);
        return client.request(originalRequest);
      }).catch(err => {
        /* Ignore refresh token request and return
         actual error for the original request*/
        return Promise.reject(err);
      })
    }

    originalRequest._retry = true;
    refreshingToken = true;
    return new Promise((resolve, reject) => {
      refreshToken()
        .then((accessToken: string) => {
          attachParamsToRequest(originalRequest, accessToken);
          processQueue(null, accessToken);
          resolve(client.request(originalRequest));
        })
        .catch((err: AxiosError) => {
          reject(err);
          forceLogout();
        }).finally(() => {
        refreshingToken = false;
      })
    });
  };

  const onRequestSuccess = (response: AxiosResponse): AxiosResponse => {
    return response.data;
  };
  /*Inherit CancelToken Class to make use of api cancellation*/
  client.isCancel = axios.isCancel;
  client.CancelToken = axios.CancelToken;
  client.interceptors.request.use(onRequestStart);
  client.interceptors.response.use(onRequestSuccess, onRequestFailure);
  return client;
}

export default createClient;
