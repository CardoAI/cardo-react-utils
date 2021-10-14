import axios from "axios";
/*cardoai-utils*/

const createClient = ({baseUrl, forceLogout, getToken, refreshToken}) => {

  let failedRequests = [];
  let refreshingToken = false;

  const client = axios.create({baseURL: baseUrl});

  const shouldIntercept = (error) => {
    try {
      return [401, 419].includes(error.response.status)
    } catch (e) {
      return false;
    }
  };

  const attachParamsToRequest = (request, token) => {
    request.headers['Authorization'] = 'Bearer ' + token;
  };

  const processQueue = (error, token = null) => {
    failedRequests.forEach(promise => {
      if (error)
        promise.reject(error);
      else
        promise.resolve(token);
    });
    failedRequests = [];
  };

  const onRequestStart = (request) => {
    const token = getToken();
    attachParamsToRequest(request, token)
    return request;
  }

  const onRequestFailure = (error) => {

    if (!shouldIntercept(error))
      return Promise.reject(error);

    if (error.config._retry || error.config._queued)
      return Promise.reject(error);

    const originalRequest = error.config;

    if (refreshingToken) {
      return new Promise(function (resolve, reject) {
        failedRequests.push({resolve, reject})
      }).then(token => {
        originalRequest._queued = true;
        attachParamsToRequest(originalRequest, token);
        return client.request(originalRequest);
      }).catch(err => {
        /* Ignore refresh token request and return
         actual error for the original request*/
        return Promise.reject(err);
      })
    }

    originalRequest._retry = true;
    refreshingToken = true;
    return new Promise((resolve, reject) => {
      refreshToken()
        .then((accessToken) => {
          attachParamsToRequest(originalRequest, accessToken);
          processQueue(null, accessToken);
          resolve(client.request(originalRequest));
        })
        .catch((err) => {
        reject(err);
        forceLogout();
      }).finally(() => {
        refreshingToken = false;
      })
    });
  };

  const onRequestSuccess = (response) => {
    return response.data;
  };

  /*Inherit CancelToken Class to make use of api cancellation*/
  client.isCancel = axios.isCancel;
  client.CancelToken = axios.CancelToken;
  client.interceptors.request.use(onRequestStart);
  client.interceptors.response.use(onRequestSuccess, onRequestFailure);

  return client;
}

export default createClient;
