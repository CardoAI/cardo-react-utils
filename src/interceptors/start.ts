import {AxiosInstance, AxiosRequestConfig} from "axios";

interface CreateInterceptorParams {
  client: AxiosInstance,
  getToken: () => string,
}

const createInterceptor = ({client, getToken}: CreateInterceptorParams) => {
  return client.interceptors.request.use((request: AxiosRequestConfig) => {
    if (request != undefined && request.headers != undefined)
      request.headers['Authorization'] = 'Bearer ' + getToken();
    return request;
  })
}

export default createInterceptor;
