import {useState, useEffect} from "react";
import queryString from "query-string";
import {IQueryProps, ICreateUseQuery, IOptions} from "./interfaces";
import {useDidUpdate} from "../hooks/useDidUpdate";

const createUseQuery = ({client, cache, controller, notification, baseURL}: ICreateUseQuery) =>
  ({
     url,
     deps = [],
     onError,
     onSuccess,
     errorMessage,
     successMessage,
     onPrepareResponse,
     useCache = true,
     query: initialQuery,
     useCacheOnly = false,
     fetchOnMount = true,
     displayMessages = false,
     cancelPreviousCalls = true
   }: IQueryProps) => {

    const loadFromCache = (key: string) => {
      if (!useCache || !cache || !cache.includes(key)) return;
      return cache.get(key);
    };

    const storeToCache = (key: string, value: any) => {
      if (!useCache || !cache) return;
      cache.set(key, value);
    }

    const queryUrl = typeof url === 'function' ? url(deps) : url;

    const [query, setQuery] = useState<any>(initialQuery);
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>(() => loadFromCache(queryUrl));

    useEffect(() => {
      if (fetchOnMount) getData();
      return () => {
        cancel();
      }
    }, []);

    useDidUpdate(() => {
      if (deps.length === 0) return;
      getData();
    }, deps);

    useDidUpdate(() => {
      getData();
    }, [query]);

    const displaySuccessMessage = () => {
      if (!successMessage) return;
      notification.success(successMessage);
    };

    const displayErrorMessage = () => {
      if (!errorMessage) return;
      notification.error(errorMessage);
    };

    const getSourceUrl = (): string => {
      return queryUrl?.split('?')[0];
    };

    const getData = async () => {
      let endpoint: string = queryUrl;
      if (!endpoint) return

      setLoading(true);
      const sourceUrl: string = getSourceUrl();

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

      const options: IOptions = {
        method: 'get',
        url: endpoint
      };

      if (source) options.cancelToken = source.token;
      if (baseURL) options.baseURL = baseURL;

      try {
        let response: any = await client(options);
        if (onPrepareResponse) response = onPrepareResponse(response);
        storeToCache(endpoint, response);
        setData(response);
        if (displayMessages) displaySuccessMessage();
        if (onSuccess) onSuccess(response);
        return response;
      } catch (e) {
        if (!client.isCancel(e)) {
          if (onError) onError(e);
          if (displayMessages) displayErrorMessage();
        }
        throw e;
      } finally {
        controller.removeSource(sourceUrl);
        setLoading(false);
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
      setLoading(false);
    };

    const updateQuery = (updates: any) => {
      setQuery((prevState: any) => {
        return {...prevState, ...updates};
      });
    }

    return {
      loading, data, setData, url,
      reset, cancel, query, updateQuery, fetch: getData
    }
  }

export default createUseQuery;
