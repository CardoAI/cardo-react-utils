import {AxiosInstance, CancelTokenStatic} from "axios";

interface IClient extends AxiosInstance {
    isCancel?: (param?: any) => boolean,
    CancelToken?: CancelTokenStatic,
}

interface ICreateUseQuery {
    client: any,
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
    onError?: (param?: any) => void,
    onSuccess?: (param?: any) => void,
    successMessage?: any,
    errorMessage?: any,
    cancelPreviousCalls?: boolean,
    useCache?: boolean,
    useCacheOnly?: boolean,
}

interface IQueryProps extends IApiParams {
    url: (deps: any[]) => string
    onPrepareResponse?: (param?: any) => any,
    query?: any,
    deps?: any[],
    fetchOnMount?: boolean,
    displayMessages?: boolean,
}

interface ICreateCallApiProps extends IApiParams {
    url: string,
    setLoading?: any,
    onFinish?: (param?: any) => void,
    body?: any,
    method?: string,
    dataType?: string,
    invalidDataMessage?: string,
    canDisplayError?: (status: number) => boolean,
    onUploadProgress?: () => void,
}

interface IOptions {
    cancelToken?: any,
    baseURL?: string,
    method?: string,
    url?: string,
    headers?: any,
    data?: any,
    onUploadProgress?: () => void,
}

interface IClientDownloadOptions {
    client?: any,
    baseURL?: string,
}

interface IClientDownloadProps {
    url: string,
    headers?: any,
    filename: string,
    onFinish?: () => void,
    onError?: (param?: any) => void,
    link?: boolean,
    [x: string]: any,
}

interface IClientDownloadParams {
    method: string,
    responseType: string,
    headers: any,
    baseURL?: string,
    [x: string]: any,
}

interface IQueryProviderValuesProps {
    addKey: (key: string) => void,
    removeKey: (key: string) => void,
    keys: string[],
}

interface ICreateControllerParams {
    client: any,
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
    IQueryProps,
    IOptions,
    ICreateUseQuery,
    ICreateCallApiProps,
    ICreateClientParams,
    IClientDownloadOptions,
    IClientDownloadProps,
    IClientDownloadParams,
    IQueryProviderValuesProps,
    ICreateControllerParams,
    ICreateClientStorageParams
}
