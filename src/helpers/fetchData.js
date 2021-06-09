// //Helpers
// import { displayError, SuperFetch } from "../helpers"
// import { AUTH_SERVICE } from "../redux/auth/constants";
//
// function generateId() {
//   return '_' + Math.random().toString(36).substr(2, 9);
// }
//
// //Custom Helpers
// let controller, signal, invoked = 0, uniqueIdentifier = generateId();
//
// function generateUniqueID() {
//   invoked = invoked + 1;
//   if (invoked - 1 === 0)
//     return uniqueIdentifier;
//   return generateId();
// }
//
// const parsers = {
//   isValid: (identifier) => {
//     return identifier === uniqueIdentifier;
//   },
//   json: (response) => {
//     //use redux here
//     AUTH_SERVICE.validateResponse(response);
//     return response.json();
//   },
//   error: (e) => {
//     console.log(e);
//     displayError("An error happened. Please Try Again!");
//   },
//   success: (setData, identifier, setLoading, controller) => (response) => {
//     if (parsers.isValid(identifier)) {
//       setData(response);
//       if (setLoading)
//         setLoading(false);
//       if (controller)
//         controller.abort();
//     }
//   },
//   final: (setLoading, identifier) => () => {
//     // if (parsers.isValid(identifier))
//     return setLoading(false);
//   }
// };
//
//
// export default (config) => {
//   const {url, setLoading, onSuccess} = config;
//   uniqueIdentifier = generateUniqueID();
//   // Feature detect
//   if ("AbortController" in window) {
//     controller = new AbortController();
//     signal = controller.signal;
//   }
//   try {
//     setLoading(true);
//     return SuperFetch.get(url)
//       .then(parsers.json)
//       .then(parsers.success(onSuccess, uniqueIdentifier, setLoading, controller))
//       .catch(parsers.error)
//       .finally(parsers.final(setLoading, uniqueIdentifier))
//   } catch (error) {
//     parsers.error(error);
//   }
// }