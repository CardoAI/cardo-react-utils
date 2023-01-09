import { useState, useEffect, useRef } from "react";
import queryString from "query-string";
import axios, { AxiosRequestConfig } from "axios";
import { useDidUpdate } from "../hooks/useDidUpdate";
import { IUseQueryParams, ICreateApiParams, IQueryServices } from "./interfaces";

enum REQUEST_STATUS { OK, LOADING, FAILED }
const INVALIDATE_QUERY_KEY: string = 'invalidate_query_event';

const createUseQuery = (createParams: ICreateApiParams) => (params: IUseQueryParams) => {

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

  const getUrl = (): string => {
    return typeof url === 'function' ? url() : url;
  }

  const getQueryIdentifier = (): string => {
    return getUrl()?.split('?')[0];
  };

  const loadFromCache = () => {
    const key = getQueryIdentifier();
    if (!useCache || !cache || !cache.includes(key)) return;
    return cache.get(key);
  };

  const storeToCache = (value: any) => {
    const key = getQueryIdentifier();
    if (!useCache || !cache) return;
    cache.set(key, value);
  }

  const isMounted = useRef<boolean>(true);
  const [data, setData] = useState(() => loadFromCache());
  const [queryState, setQueryState] = useState<any>(query);
  const [requestStatus, setRequestStatus] = useState<REQUEST_STATUS>(() => {
    return fetchOnMount ? REQUEST_STATUS.LOADING : REQUEST_STATUS.OK;
  });

  useEffect(() => {
    if (fetchOnMount) (async () => await fetch())();

    const invalidateQueryHandler = (event: any) => {
      if (event.data.type !== INVALIDATE_QUERY_KEY || event.data.useQueryIdentifier !== getQueryIdentifier()) return;
      (async () => await fetch())();
    }

    window.addEventListener('message', invalidateQueryHandler);

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

    const previous: any = loadFromCache();
    if (previous) setData(previous);
    if (useCacheOnly && previous) return;

    const options: AxiosRequestConfig = {
      url: endpoint,
      method: 'get',
    };

    if (source) options.cancelToken = source.token;
    if (baseURL) options.baseURL = baseURL;

    try {
      setRequestStatus(REQUEST_STATUS.LOADING);
      let response: any = isPublic ? await axios.request(options) : await client(options);

      if (!isMounted.current) return;

      setRequestStatus(REQUEST_STATUS.OK);
      if (onPrepareResponse) response = onPrepareResponse(response);

      storeToCache(response);
      setData(response);

      if (displayMessages) displaySuccessMessage();
      if (onSuccess) onSuccess(response);

    } catch (error) {
      setRequestStatus(REQUEST_STATUS.FAILED);
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
    setRequestStatus(REQUEST_STATUS.OK);
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
    failed: requestStatus === REQUEST_STATUS.FAILED,
    loading: requestStatus === REQUEST_STATUS.LOADING,
  }
}

export default createUseQuery;

const invalidateQuery = (baseUrl: string) => {
  window.postMessage({
    type: INVALIDATE_QUERY_KEY,
    useQueryIdentifier: baseUrl,
  });
}

export const QueryServices: IQueryServices = {
  invalidateQuery,
  // todo implement the query services below
  // getQueryData: (key: string) => any,
  // setQueryData: (key: string, (prev: any) => any) => void,
  // getQueryStatus: (key: string) => string,
  // invalidateCachedQuery: (key: string) => void,
  // getCachedQueryData: (key: string) => any,
  // setCachedQueryData: (key: string, (key: string) => any) => void,
};
