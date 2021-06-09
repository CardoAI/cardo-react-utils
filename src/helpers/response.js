// import React from "react";
// import { message, Modal, notification } from "antd";
// import { humanString, storage, SuperFetch } from "./index";
// import Analytics from "../analytics";
// import { AUTH_SERVICE, AUTH_STORE } from "../redux/auth/constants";
// //Analytics
//
//
// export const AXIOS_HELPERS = {
//   getHeaders: () => {
//     const headers = {
//       'Accept': 'application/json',
//       'Content-Type': 'multipart/form-data'
//     };
//
//     const token = AUTH_STORE.getToken();
//
//     if (token)
//       headers.Authorization = 'Token ' + token;
//
//     return headers;
//   }
// }
//
//
// export const transformInToFormObject = (data) => {
//   let formData = new FormData();
//
//   const computeArray = (array) => {
//     array.forEach((obj, index) => {
//       let keyList = Object.keys(obj);
//       keyList.forEach((keyItem) => {
//         let keyName = [key, "[", index, "]", ".", keyItem].join("");
//         formData.append(keyName, obj[keyItem]);
//       });
//     });
//   }
//
//   const computeObject = (object) => {
//     for (let innerKey in object) {
//       if (object.hasOwnProperty(innerKey)) {
//         formData.append(`${key}.${innerKey}`, data[key][innerKey]);
//       }
//     }
//   }
//
//
//   for (let key in data) {
//     if (data.hasOwnProperty(key)) {
//       if (Array.isArray(data[key])) {
//         computeArray(data[key]);
//       } else if (typeof data[key] === "object") {
//         computeObject(data[key])
//       } else {
//         formData.append(key, data[key]);
//       }
//     }
//   }
//   return formData;
// }
//
//
// export const displayError = (description = "An error happened. Please Try Again!", message = "Error") => {
//   notification.error({message, description})
// };
//
// export const displayWarning = (description, message = "Warning", duration) => {
//   notification.warning({message, description, duration: duration})
// };
//
// export const displayNotificationBox = (description, message = "Information", duration = 8) => {
//
//   Modal.info({
//     title: message,
//     className: "smallModal",
//     maskClosable: true,
//     content: description,
//     width: 600
//   });
// }
//
// export const displayInformation = (description, message = "Information", duration = 5) => {
//   notification.info({message, description, duration: duration});
// }
//
// export const displaySuccess = (description, message = "Success", duration) => {
//   notification.success({message, description, duration: duration})
// };
//
// export const displayDevelopment = () => {
//   message.warning("This feature is under development")
// }
//
// export function prepareInvalidDataErrors(data) {
//
//   let errors = "";
//   if (Array.isArray(data))
//     data.forEach(message => errors += `${message}\n`);
//   else if (typeof data === 'object')
//     Object.entries(data).forEach(([attr, message]) => errors += `${humanString(attr)}: ${message}\n`);
//
//   return errors
// }
//
// export async function processResponse({
//                                         response,
//                                         jsonParse = true,
//                                         displaySuccessMessage = true,
//                                         successMessage = "Saved Successfully",
//                                         errorMessage = "An error happened. Please Try Again!",
//                                         invalidDataMessage = "Invalid Data",
//                                         onSuccess, onError, onFinish
//                                       }) {
//   function callSuccess(responseData) {
//     if (onSuccess)
//       onSuccess(responseData);
//     if (onFinish)
//       onFinish();
//   }
//
//   function callError() {
//     if (onError)
//       onError();
//     if (onFinish)
//       onFinish();
//   }
//
//
//   if (response.success && !response.status) {
//     callSuccess();
//     return {success: true, responseData: null};
//   }
//
//   // Server Error
//   if (response.status === 500) {
//     displayError(errorMessage);
//     callError();
//     return {success: false, responseData: null};
//   }
//
//   if (response.status === 204) {
//     if (displaySuccessMessage)
//       displaySuccess(successMessage);
//     callSuccess();
//     return {success: true, responseData: null};
//   }
//
//   AUTH_SERVICE.validateResponse(response, true);
//
//   if (!response.status.toString().startsWith("2")) {
//     Analytics.dispatchGAEvent({
//       category: Analytics.getEventCategory().NetworkErrors,
//       action: 'An error has occurred',
//       label: `Status code is: ${response.status}`
//     })
//   }
//
//   AUTH_SERVICE.validateResponse(response, true);
//
//   let responseData = response;
//
//   if (jsonParse)
//     responseData = await response.json();
//
//
//   if (!response.statusText === "OK") {
//     // Bad request
//     if (response.status === 400)
//       displayWarning(prepareInvalidDataErrors(responseData), invalidDataMessage);
//     // Any other client error
//     else if (response.status.toString().startsWith("4"))
//       displayWarning(responseData.message);
//     else
//       displayError(errorMessage);
//     callError();
//     return {success: false, responseData: null};
//   }
//
//   if (displaySuccessMessage)
//     displaySuccess(successMessage);
//   callSuccess(responseData);
//
//   return {success: true, responseData};
// }
//
//
// /*
// Object that stores the AbortController of each call.
// The key is represented by the URI of the call, without the query params.
//  */
// const callsRegistry = {}
//
// export async function callApi(url, {
//   method = "get",
//   body,
//   dataType = "json",
//   setLoading,
//   cancelPreviousCalls = true
// }) {
//   function removeCallAbortController() {
//     if (cancelPreviousCalls)
//       delete callsRegistry[callUri];
//   }
//
//   if (setLoading)
//     setLoading(true);
//
//   let callUri, signal;
//   if (cancelPreviousCalls) {
//     callUri = url ? url.split("?")[0] : null;
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
//   return SuperFetch[method](url, body, dataType, signal);
// }
