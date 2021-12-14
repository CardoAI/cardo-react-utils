import React from "react";
import {IClientProps, ICreateUseClientApi, IOptions} from "../interfaces";

const createUseClientApi = ({client, controller, notification, baseURL}: ICreateUseClientApi) =>
    ({
         url,
         onError,
         onSuccess,
         errorMessage,
         successMessage,
         fetchOnMount = true,
         displayMessages = false,
         cancelPreviousCalls = true
     }: IClientProps) => {

        const [clientUrl, setClientUrl] = React.useState<string>(url);
        const [data, setData] = React.useState<any>(null);
        const [loading, setLoading] = React.useState<boolean>(false);

        // @ts-ignore
        React.useEffect(async () => {
            if (fetchOnMount)
                await fetch();

            return () => {
                cancel();
            }
        }, [])

        const displaySuccessMessage = (): void => {
            if (!successMessage)
                return;

            notification.success(successMessage);
        };

        const displayErrorMessage = (): void => {
            if (!errorMessage)
                return;

            notification.error(errorMessage);
        };

        const getSourceUrl = (): string => {
            return clientUrl.split('?')[0];
        };

        const fetch = async () => {

            if (!clientUrl)
                return

            setLoading(true);

            const sourceUrl = getSourceUrl();

            if (cancelPreviousCalls) {
                controller.cancelPreviousCall(sourceUrl);
                controller.createSource(sourceUrl);
            }

            const source = controller.getSource(sourceUrl);

            const options: IOptions = {
                method: 'get',
                url: clientUrl
            };

            if (source)
                options.cancelToken = source.token;

            if (baseURL)
                options.baseURL = baseURL;

            try {
                const response = await client(options);
                setData(response);

                if (displayMessages)
                    displaySuccessMessage();

                if (onSuccess)
                    onSuccess(response);

                return response
            } catch (e) {
                if (!client.isCancel(e)) {
                    if (onError)
                        onError(e);
                    if (displayMessages)
                        displayErrorMessage();
                }
                throw e;
            } finally {
                controller.removeSource(sourceUrl);
                setLoading(false);
            }
        };

        const cancel = (): void => {
            const sourceUrl = getSourceUrl();
            controller.cancelPreviousCall(sourceUrl);
            controller.removeSource(sourceUrl);
        };

        const changeUrl = (current: string): void => {
            setClientUrl(current)
        };

        const reset = (cancelPrevious: boolean = false): void => {
            if (!cancelPrevious)
                cancel();

            setData(null);
            setLoading(false);
        }

        return {
            loading, data, setData,
            fetch, reset, cancel, changeUrl
        }
    }

export default createUseClientApi;