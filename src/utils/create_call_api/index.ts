import { AxiosError, AxiosResponse } from "axios";
import { ICreateCallApiProps, ICreateUseClientApi, IOptions } from "../interfaces";

export default ({client, controller, notification, baseURL}: ICreateUseClientApi) =>
  ({
     url,
     body,
     successMessage,
     method = "get",
     dataType = "json",
     cancelPreviousCalls = false,
     invalidDataMessage = "Invalid Data",
     setLoading, onSuccess, onError, onFinish,
     errorMessage = "An error happened. Please Try Again!",
   }: ICreateCallApiProps) => {

    const baseUrl = url.split('?')[0];

    if (cancelPreviousCalls) {
      controller.cancelPreviousCall(baseUrl);
      controller.removeSource(baseUrl);
      controller.createSource(baseUrl);
    }

    if (setLoading)
      setLoading(true);

    const options: IOptions = {
      url: url,
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }

    const source = controller.getSource(baseUrl);

    if (dataType === 'form')
      options.headers['Content-Type'] = "multipart/form-data"

    if (body)
      options.data = body;

    if (baseURL)
      options.baseURL = baseURL;

    if (source)
      options.cancelToken = source.token;

    return client(options).then((response: AxiosResponse) => {

      if (successMessage)
        notification.success(successMessage);

      if (onSuccess)
        onSuccess(response);

      return response;

    }).catch((error: AxiosError) => {

      const notifyError = () => {
        if (onError)
          onError();
      }

      if (error.response) {
        const {status, data} = error.response;

        if (status === 500) {
          notification.error(errorMessage);
        } else if (status === 400) {
          let errors = "";

          if (Array.isArray(data)) {
            data.forEach(message => errors += `${message}\n`);
          } else if (typeof data === 'object') {
            Object.entries(data).forEach(([attr, message]) => errors += `${attr}: ${message}\n`);
          }

          notification.warning(errors, invalidDataMessage);
        } else if (status.toString().startsWith("4")) {
          notification.warning(data.message);
        } else {
          notification.error(errorMessage);
        }

        notifyError();
      } else if (error.request) {
        // The request was made but no response was received
        notifyError();
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        notifyError();
        console.log('Error', error.message);
      }
    }).finally(() => {
      if (setLoading)
        setLoading(false);

      if (onFinish)
        onFinish();
    });
  }


