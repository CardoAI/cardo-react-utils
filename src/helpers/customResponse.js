// import config from '../settings';
// import { storage } from "./storage";
// import { AUTH_SERVICE } from "../redux/auth/constants";
// import { displayError, displaySuccess, displayWarning, prepareInvalidDataErrors } from "./response";
//
// export function verifyAuthorization(response) {
//   if (response.status === 401) {
//     // const state = store.getState();
//     // // Do not dispatch logout action if user is already logged out
//     // if (state.Auth.token)
//     //   store.dispatch({type: "LOGOUT", sessionExpired: true})
//     return false;
//   }
//   return true;
// }
//
// const prepareHeaders = (dataType) => {
//
//
//   const token = storage.get("token");
//
//   const headers = {
//     'Accept': 'application/json',
//   };
//
//   if (token)
//     headers.Authorization = 'Token ' + token;
//
//
//   if (dataType === 'json')
//     headers['Content-Type'] = 'application/json';
//   return headers;
// };
//
// const prepareBody = {
//   json: data => JSON.stringify(data),
//   form: data => data
// };
//
// const base = (method, url, data = null, dataType = 'json', signal) => {
//   return fetch(`${config.apiUrl}${url}`, {
//     method,
//     headers: prepareHeaders(dataType),
//     body: data ? prepareBody[dataType](data) : undefined,
//     signal
//   })
// };
//
// export const SuperFetch = {};
// ['get', 'post', 'put', 'delete'].forEach(method => {
//   SuperFetch[method] = base.bind(null, method);
// });
//
// /*
// Object that stores the AbortController of each call.
// The key is represented by the URI of the call, without the query params.
//  */
// const callsRegistry = {}
//
// export async function callApiWithCancellation(url, {
//   method = "get",
//   body,
//   dataType = "json",
//   successMessage,
//   errorMessage = "An error happened. Please Try Again!",
//   invalidDataMessage = "Invalid Data",
//   setLoading,
//   onSuccess, onError, onFinish,
//   cancelPreviousCalls = false
// }) {
//   function removeCallAbortController() {
//     if (cancelPreviousCalls)
//       delete callsRegistry[callUri];
//   }
//
//   function callSuccess(responseData) {
//     if (onSuccess)
//       onSuccess(responseData);
//     if (onFinish)
//       onFinish();
//
//     if (setLoading)
//       setLoading(false);
//
//     removeCallAbortController();
//   }
//
//   function callError() {
//     if (onError)
//       onError();
//     if (onFinish)
//       onFinish();
//
//     if (setLoading)
//       setLoading(false);
//
//     removeCallAbortController();
//   }
//
//   if (setLoading)
//     setLoading(true);
//
//   let callUri, signal;
//   if (cancelPreviousCalls) {
//     callUri = url.split("?")[0];
//     const previousActiveCall = callsRegistry[callUri];
//
//     if (previousActiveCall)
//       previousActiveCall.abort();
//
//     const controller = new AbortController();
//     signal = controller.signal;
//
//     callsRegistry[callUri] = controller;
//   }
//
//   try {
//     const response = await SuperFetch[method](url, body, dataType, signal);
//
//     AUTH_SERVICE.validateResponse(response, true);
//
//     // Server Error
//     if (response.status === 500) {
//       displayError(errorMessage);
//       callError();
//       return;
//     }
//
//     if (response.status === 204) {
//       if (successMessage)
//         displaySuccess(successMessage);
//       callSuccess();
//       return;
//     }
//
//     const responseData = await response.json()
//
//     if (!response.ok) {
//       // Bad request
//       if (response.status === 400)
//         displayWarning(prepareInvalidDataErrors(responseData), invalidDataMessage);
//       // Any other client error
//       else if (response.status.toString().startsWith("4"))
//         displayWarning(responseData.message);
//       else
//         displayError(errorMessage);
//       callError();
//
//       return;
//     }
//
//     if (successMessage)
//       displaySuccess(successMessage);
//     callSuccess(responseData);
//   } catch (exception) {
//     // DOMException is raised when an abort happens. Skip it
//     if (!exception instanceof DOMException)
//       throw exception;
//   }
// }
//
