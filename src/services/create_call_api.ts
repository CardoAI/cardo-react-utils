import axios, {AxiosRequestConfig, AxiosResponse, Method} from "axios";
import {ICallApiParams, ICreateApiParams} from "./interfaces";

const getOptions = (
  url: string,
  method: Method,
  dataType: string,
  body: any,
  baseURL: string | undefined,
  source: any,
  onUploadProgress?: (progressEvent: any) => void
): AxiosRequestConfig => {
    const options: AxiosRequestConfig = {
        url: url,
        method: method,
        onUploadProgress: onUploadProgress,
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    };
    if (dataType === 'form' && !!options.headers) options.headers['Content-Type'] = "multipart/form-data";
    if (body) options.data = body;
    if (baseURL) options.baseURL = baseURL;
    if (source) options.cancelToken = source.token;
    return options;
}

const cancelPreviousCallsFn = (controller: any, baseUrl: string): void => {
    controller.cancelPreviousCall(baseUrl);
    controller.removeSource(baseUrl);
    controller.createSource(baseUrl);
}

const loadFromCache = (key: string, cache: any): any => {
    if (cache.includes(key)) return cache.get(key);
    return undefined;
}

const storeToCache = (key: string, value: any, cache: any): void => {
    cache.set(key, value);
}

const createCallApi = (createParams: ICreateApiParams) => async (params: ICallApiParams): Promise<any> => {

  const { client, cache, controller, notification, baseURL } = createParams;

  const {
    url,
    body,
    onError,
    onFinish,
    onSuccess,
    setLoading,
    successMessage,
    method = "get",
    onUploadProgress,
    isPublic = false,
    useCache = false,
    dataType = "json",
    useCacheOnly = false,
    cancelPreviousCalls = false,
  } = params;

  const canUseCache: boolean = (method === 'get' && useCache && cache !== undefined);
  const previous: any = canUseCache ? loadFromCache(url, cache) : undefined;

  if (previous) {
    if (useCacheOnly) return;
    if (onSuccess) onSuccess(previous);
  }

  const baseUrl = url.split('?')[0];

  if (cancelPreviousCalls) cancelPreviousCallsFn(controller, baseUrl);
  if (setLoading) setLoading(true);

  const source: any = controller.getSource(baseUrl);
  const options: AxiosRequestConfig = getOptions(url, method, dataType, body, baseURL, source, onUploadProgress);

  try {
    const response: AxiosResponse = isPublic ? await axios.request(options) : await client(options);
    if (canUseCache) storeToCache(url, response, cache);
    if (successMessage) notification.success(successMessage);
    if (onSuccess) onSuccess(response);
    return response;
  } catch (error: any) {
    if (onError) onError(error);
  } finally {
    if (setLoading) setLoading(false);
    if (onFinish) onFinish();
  }
}

export default createCallApi;
