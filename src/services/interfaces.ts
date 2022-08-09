import {AxiosInstance, CancelTokenStatic, Method} from "axios";

interface IClient extends AxiosInstance {
  isCancel?: (param?: any) => boolean,
  CancelToken?: CancelTokenStatic,
}

interface ICreateApiParams {
  client: IClient,
  controller: any,
  notification: NotificationInstance | NotificationInitialization,
  baseURL?: string,
  cache?: any,
}

interface NotificationInstance {
  success: (args: string) => void,
  error: (args: string | null) => void,
  info: (args: string) => void,
  warning: (param1?: string, param2?: string) => void,
  open: (args: string) => void,
}

interface NotificationInitialization {
  error: (description?: string, message?: string) => void,
  warning: (description?: string, message?: string) => void,
  success: (description?: string, message?: string) => void,
}

interface IApiParams {
  url: string | ((deps: any[]) => string),
  onError?: (param?: any) => void,
  onSuccess?: (param?: any) => void,
  successMessage?: string,
  cancelPreviousCalls?: boolean,
  useCache?: boolean,
  useCacheOnly?: boolean,
  isPublic?: boolean,
}

interface IUseQueryParams extends IApiParams {
  onPrepareResponse?: (param?: any) => any,
  query?: any,
  deps?: any[],
  fetchOnMount?: boolean,
  displayMessages?: boolean,
}

interface ICallApiParams extends IApiParams {
  url: string,
  setLoading?: (loading: boolean) => void,
  onFinish?: (param?: any) => void,
  body?: any,
  method?: Method,
  dataType?: 'json' | 'form',
  onUploadProgress?: (progressEvent: any) => void,
}

interface IClientDownloadOptions {
  client?: IClient,
  baseURL?: string,
}

interface IClientDownloadProps {
  url: string,
  headers?: any,
  filename: string,
  onFinish?: () => void,
  onError?: (param?: any) => void,
  link?: boolean,
  target?: string,
  [key: string]: any,
}

interface IClientDownloadParams {
  method: string,
  responseType: string,
  headers: any,
  baseURL?: string,
  [key: string]: any,
}

interface ICreateControllerParams {
  client: IClient,
}

interface ICreateClientParams {
  baseURL?: string
}

interface ICreateClientStorageParams {
  accessKey: string,
  refreshKey: string,
  roleKey?: string
}

export type {
  IClient,
  ICallApiParams,
  IUseQueryParams,
  ICreateApiParams,
  ICreateClientParams,
  IClientDownloadProps,
  IClientDownloadParams,
  IClientDownloadOptions,
  ICreateControllerParams,
  ICreateClientStorageParams,
};
