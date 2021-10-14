import React, { useState, useEffect } from "react";

const createUseClientApi = ({client, controller, notification, baseURL}) =>
  ({
     url,
     onError,
     onSuccess,
     errorMessage,
     successMessage,
     fetchOnMount = true,
     displayMessages = false,
     cancelPreviousCalls = true
   }) => {

    const [clientUrl, setClientUrl] = useState(url);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(async () => {
      if (fetchOnMount)
        await fetch();

      return () => {
        cancel();
      }
    }, [])

    const displaySuccessMessage = () => {
      if (!successMessage)
        return;

      notification.success(successMessage);
    };

    const displayErrorMessage = () => {
      if (!errorMessage)
        return;

      notification.error(errorMessage);
    };

    const getSourceUrl = () => {
      return clientUrl.split('?')[0];
    };

    const fetch = async () => {

      setLoading(true);

      const sourceUrl = getSourceUrl();

      if (cancelPreviousCalls) {
        controller.cancelPreviousCall(sourceUrl);
        controller.createSource(sourceUrl);
      }

      const source = controller.getSource(sourceUrl);

      const options = {
        method: 'get',
        url: clientUrl
      };

      if (source)
        options.cancelToken = source.token;

      if (baseURL)
        options.baseURL = baseURL;

      try {
        const response = await client(options);
        setData(response.data);

        if (displayMessages)
          displaySuccessMessage();

        if (onSuccess)
          onSuccess(response.data);

        return response.data
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

    const cancel = () => {
      const sourceUrl = getSourceUrl();
      controller.cancelPreviousCall(sourceUrl);
      controller.removeSource(sourceUrl);
    };

    const changeUrl = (current) => {
      setClientUrl(current)
    };

    const reset = (cancelPrevious = false) => {
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