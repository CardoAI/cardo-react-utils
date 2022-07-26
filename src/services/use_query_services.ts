import { useState, useEffect } from "react";
import queryString from "query-string";
import {IUseQueryParams, ICreateApiParams} from "./interfaces";
import {useDidUpdate} from "../hooks/useDidUpdate";
import axios, {AxiosRequestConfig} from "axios";

enum STATUS_ENUM {
  OK,
  LOADING,
  FAILED,
}

const INVALIDATE_QUERY_KEY: string = 'invalidate_query';

const invalidateQuery = (key: string) => {
  window.postMessage({
    type: INVALIDATE_QUERY_KEY,
    key: key,
  });
}

const createUseQuery = (createParams: ICreateApiParams) => (params: IUseQueryParams) => {

  const { client, cache, controller, notification, baseURL } = createParams;

  const {
    url,
    onError,
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
    ...rest
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
    return typeof url === 'function' ? url(deps) : url;
  }

  const [data, setData] = useState<any>(() => loadFromCache(getUrl()));
  const [query, setQuery] = useState<any>(rest.query);
  const [status, setStatus] = useState<STATUS_ENUM>(STATUS_ENUM.OK);

  const invalidateQueryHandler = (event: any) => {
    const { type, key } = event.data;
    if (type !== INVALIDATE_QUERY_KEY || key !== getUrl()) return;
    (async () => await fetch())();
  }

  useEffect(() => {
    window.addEventListener('message', invalidateQueryHandler);
    if (fetchOnMount) (async () => await fetch())();
    return () => {
      window.removeEventListener('message', invalidateQueryHandler);
      cancel();
    }
  }, []);

  useDidUpdate(() => {
    if (deps.length === 0) return;
    (async () => await fetch())();
  }, deps);

  useDidUpdate(() => {
    if (!query) return;
    (async () => await fetch())();
  }, [query]);

  const displaySuccessMessage = () => {
    if (!successMessage) return;
    notification.success(successMessage);
  };

  const getSourceUrl = (): string => {
    return getUrl()?.split('?')[0];
  };

  const fetch = async () => {
    let endpoint: string = getUrl();
    if (!endpoint) return;
    const sourceUrl: string = getSourceUrl();

    setStatus(STATUS_ENUM.LOADING);

    if (cancelPreviousCalls) {
      controller.cancelPreviousCall(sourceUrl);
      controller.createSource(sourceUrl);
    }

    const source = controller.getSource(sourceUrl);

    if (query) {
      const separator = endpoint.includes('?') ? '&' : '?';
      endpoint += separator + queryString.stringify(query);
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
      let response: any = isPublic ? await axios.request(options) : await client(options);
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
      controller.removeSource(sourceUrl);
    }
  };

  const cancel = () => {
    const sourceUrl: string = getSourceUrl();
    controller.cancelPreviousCall(sourceUrl);
    controller.removeSource(sourceUrl);
  };

  const reset = (cancelPrevious = false) => {
    if (!cancelPrevious) cancel();
    setData(null);
    setStatus(STATUS_ENUM.OK);
  };

  const updateQuery = (updates: any) => {
    setQuery((prevState: any) => {
      return {...prevState, ...updates};
    });
  }

  return {
    data, setData, url, fetch, reset, cancel, query, updateQuery,
    loading: status === STATUS_ENUM.LOADING, failed: status === STATUS_ENUM.FAILED,
  }
}

export default createUseQuery;

export const queryServices = {
  invalidateQuery,
};
