import {AxiosInstance, AxiosResponse} from "axios";

interface SuccessInterceptorParams {
  client: AxiosInstance,
}

const createInterceptor = ({client}: SuccessInterceptorParams) => {
  return client.interceptors.response.use((response: AxiosResponse) => {
    return response.data;
  });
}

export default createInterceptor;
