import { useState, useEffect, useRef } from "react";
import queryString from "query-string";
import { IUseQueryParams, ICreateApiParams, IQueryServices, IUseQuery } from "./interfaces";
import {useDidUpdate} from "../hooks/useDidUpdate";
import axios, {AxiosRequestConfig} from "axios";

enum STATUS_ENUM {
  OK,
  LOADING,
  FAILED,
}

const INVALIDATE_QUERY_KEY: string = 'invalidate_query';

const createUseQuery = (createParams: ICreateApiParams) => (params: IUseQueryParams): IUseQuery => {

  const { client, cache, controller, notification, baseURL } = createParams;

  const {
    url,
    query,
    onError,
    onFinish,
    onSuccess,
    deps = [],
    successMessage,
    isPublic = false,
    useCache = false,
    onPrepareResponse,
    fetchOnMount = true,
    useCacheOnly = false,
    displayMessages = false,
    cancelPreviousCalls = true,
  } = params;

  const loadFromCache = (key: string) => {
    if (!useCache || !cache || !cache.includes(key)) return;
    return cache.get(key);
  };

  const storeToCache = (key: string, value: any) => {
    if (!useCache || !cache) return;
    cache.set(key, value);
  }

  const getUrl = (): string => {
    return typeof url === 'function' ? url() : url;
  }

  const getQueryIdentifier = (): string => {
    return getUrl()?.split('?')[0];
  };

  const [data, setData] = useState<any>(() => loadFromCache(getUrl()));
  const [queryState, setQueryState] = useState<any>(query);
  const [status, setStatus] = useState<STATUS_ENUM>(() => fetchOnMount ? STATUS_ENUM.LOADING : STATUS_ENUM.OK);
  const isMounted = useRef<boolean>(true);

  const invalidateQueryHandler = (event: any) => {
    if (event.data.type !== INVALIDATE_QUERY_KEY || event.data.useQueryId !== getQueryIdentifier()) return;
    (async () => await fetch())();
  }

  useEffect(() => {
    window.addEventListener('message', invalidateQueryHandler);
    if (fetchOnMount) (async () => await fetch())();
    return () => {
      isMounted.current = false;
      window.removeEventListener('message', invalidateQueryHandler);
      cancel();
    }
  }, []);

  useDidUpdate(() => {
    if (deps.length === 0) return;
    (async () => await fetch())();
  }, deps);

  useDidUpdate(() => {
    if (!queryState) return;
    (async () => await fetch())();
  }, [queryState]);

  const displaySuccessMessage = () => {
    if (!successMessage) return;
    notification.success(successMessage);
  };

  const fetch = async () => {
    let endpoint: string = getUrl();
    if (!endpoint) return;

    const queryIdentifier: string = getQueryIdentifier();

    if (cancelPreviousCalls) {
      controller.cancelPreviousCall(queryIdentifier);
      controller.createSource(queryIdentifier);
    }

    const source = controller.getSource(queryIdentifier);

    if (queryState) {
      const separator = endpoint.includes('?') ? '&' : '?';
      endpoint += separator + queryString.stringify(queryState);
    }

    const previous: any = loadFromCache(endpoint);
    if (previous) setData(previous);

    if (useCacheOnly && previous) return;

    const options: AxiosRequestConfig = {
      method: 'get',
      url: endpoint
    };

    if (source) options.cancelToken = source.token;
    if (baseURL) options.baseURL = baseURL;

    try {
      setStatus(STATUS_ENUM.LOADING);
      let response: any = isPublic ? await axios.request(options) : await client(options);
      if (!isMounted.current) return;
      setStatus(STATUS_ENUM.OK);
      if (onPrepareResponse) response = onPrepareResponse(response);
      storeToCache(endpoint, response);
      setData(response);
      if (displayMessages) displaySuccessMessage();
      if (onSuccess) onSuccess(response);
      return response;
    } catch (error) {
      setStatus(STATUS_ENUM.FAILED);
      if (onError) onError(error);
    } finally {
      if (onFinish) onFinish();
      controller.removeSource(queryIdentifier);
    }
  };

  const cancel = () => {
    const queryIdentifier: string = getQueryIdentifier();
    controller.cancelPreviousCall(queryIdentifier);
    controller.removeSource(queryIdentifier);
  };

  const reset = (cancelPrevious = false) => {
    if (!cancelPrevious) cancel();
    setData(null);
    setStatus(STATUS_ENUM.OK);
  };

  const updateQuery = (updates: any) => {
    setQueryState((prevState: any) => {
      return {...prevState, ...updates};
    });
  }

  return {
    data,
    fetch,
    reset,
    cancel,
    setData,
    updateQuery,
    url: getUrl(),
    query: queryState,
    failed: status === STATUS_ENUM.FAILED,
    loading: status === STATUS_ENUM.LOADING,
  }
}

export default createUseQuery;

const invalidateQuery = (baseUrl: string) => {
  window.postMessage({
    type: INVALIDATE_QUERY_KEY,
    useQueryId: baseUrl,
  });
}

export const queryServices: IQueryServices = {
  invalidateQuery,
  // todo implement the query services below
  // getQueryData: (key: string) => any,
  // setQueryData: (key: string, (prev: any) => any) => void,
  // getQueryStatus: (key: string) => string,
  // invalidateCachedQuery: (key: string) => void,
  // getCachedQueryData: (key: string) => any,
  // setCachedQueryData: (key: string, (key: string) => any) => void,
};
