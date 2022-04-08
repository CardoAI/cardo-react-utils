import {useState, useEffect} from "react";
import queryString from "query-string";
import {IQueryProps, ICreateUseQuery} from "./interfaces";
import {useDidUpdate} from "../hooks/useDidUpdate";
import axios, {AxiosRequestConfig} from "axios";

const createUseQuery = ({client, cache, controller, notification, baseURL}: ICreateUseQuery) =>
    ({
         url,
         onError,
         deps = [],
         isPublic = false,
         onSuccess,
         errorMessage,
         successMessage,
         onPrepareResponse,
         useCache = false,
         useCacheOnly = false,
         fetchOnMount = true,
         displayMessages = false,
         cancelPreviousCalls = true,
         ...rest
    }: IQueryProps) => {

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

        const [query, setQuery] = useState<any>(rest.query);
        const [loading, setLoading] = useState<boolean>(false);
        const [data, setData] = useState<any>(() => loadFromCache(getUrl()));

        useEffect(() => {
            if (fetchOnMount) fetch();
            return () => cancel();
        }, []);

        useDidUpdate(() => {
            if (deps.length === 0) return;
            fetch();
        }, deps);

        useDidUpdate(() => {
            if (!query) return;
            fetch();
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
            return getUrl()?.split('?')[0];
        };

        const fetch = async () => {

            /*Replace async await using .then callback hell */

            let endpoint: string = getUrl();

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

            const options: AxiosRequestConfig = {
                method: 'get',
                url: endpoint
            };

            if (source) options.cancelToken = source.token;
            if (baseURL) options.baseURL = baseURL;

            try {
                let response: any = isPublic ? await axios.request(options) : await client(options);
                if (onPrepareResponse) response = onPrepareResponse(response);
                storeToCache(endpoint, response);
                setData(response);
                if (displayMessages) displaySuccessMessage();
                if (onSuccess) onSuccess(response);
                return response;
            } catch (e) {
                if (!isPublic && client.isCancel && !client.isCancel(e)) {
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
            loading, data, setData, url, fetch,
            reset, cancel, query, updateQuery
        }
    }

export default createUseQuery;
