import {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";

interface LoaderInterceptorParams {
  client: AxiosInstance,
  start: () => void,
  end: () => void,
}

const createInterceptor = ({client, start, end}: LoaderInterceptorParams) => {
  client.interceptors.request.use((config: AxiosRequestConfig) => {
    start();
    return config;
  }, (error: any) => {
    end();
    return Promise.reject(error);
  });

  client.interceptors.response.use((response: AxiosResponse) => {
    end();
    return response;
  }, (error: any) => {
    end();
    return Promise.reject(error);
  });
}

export default createInterceptor;
