import {AxiosInstance, CancelTokenStatic} from "axios";
import Controller from "./create_controller";

interface ICreateClient {
    baseUrl?: string,
    forceLogout: () => void,
    getToken: () => string,
    refreshToken: () => Promise<any>,
}

interface IClient extends AxiosInstance {
    isCancel?: (param?: any) => boolean,
    CancelToken?: CancelTokenStatic,
}

interface ICreateUseClientApi {
    client: any,
    controller: IController | Controller,
    notification: NotificationInstance,
    baseURL?: string | undefined
}

interface NotificationInstance {
    success: (args: string) => void;
    error: (args: string | null) => void;
    info: (args: string) => void;
    warning: (param1?: string, param2?: string) => void;
    open: (args: string) => void;
}

interface IController {
    cancelPreviousCall: (url?: string) => void,
    removeSource: (url?: string) => void,
    createSource: (url?: string) => void,
    getSource: (url?: string) => any,
}

interface IClientProps {
    url: string,
    onError?: (param?: any) => void,
    onSuccess?: (param?: any) => void,
    errorMessage?: any,
    successMessage?: any,
    fetchOnMount?: boolean,
    displayMessages?: boolean,
    cancelPreviousCalls?: boolean,
    body?: any,
    method?: string,
    dataType?: string,
}

interface ICreateCallApiProps {
    url: string,
    onError?: (param?: any) => void,
    onSuccess?: (param?: any) => void,
    successMessage?: any,
    setLoading?: any,
    onFinish?: (param?: any) => void,
    fetchOnMount?: boolean,
    displayMessages?: boolean,
    cancelPreviousCalls?: boolean,
    body?: any,
    method?: string,
    dataType?: string,
    invalidDataMessage?: string,
    errorMessage?: string,
    displaySuccessMessage?: boolean
}

interface IOptions {
    cancelToken?: any,
    baseURL?: string,
    method?: string,
    url?: string,
    headers?: any,
    data?: any
}

interface IClientDownloadOptions {
    client?: any,
    baseURL?: string
}

interface IClientDownloadProps {
    url: string,
    headers?: any,
    filename: string,
    onFinish?: () => void,
    onError?: (param?: any) => void,
    link?: boolean,
}

interface IClientDownloadParams {
    method: string,
    responseType: string,
    headers: any,
    baseURL?: string
}

export type {
    ICreateClient,
    IClient,
    IController,
    IClientProps,
    IOptions,
    ICreateUseClientApi,
    ICreateCallApiProps,
    IClientDownloadOptions,
    IClientDownloadProps,
    IClientDownloadParams
}