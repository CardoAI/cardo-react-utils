// import config from '../settings';
// import { AUTH_STORE } from "../redux/auth/constants";
//
// const prepareHeaders = (dataType) => {
//   const token = AUTH_STORE.getToken();
//
//   const headers = {
//     'Accept': 'application/json',
//   };
//
//   if (token)
//     headers.Authorization = 'Token ' + token;
//
//   if (dataType === 'json')
//     headers['Content-Type'] = 'application/json';
//
//   return headers;
// };
//
// const prepareBody = {
//   json: data => JSON.stringify(data),
//   form: data => data,
// };
//
// const base = (method, url, data = null, dataType = 'json', appendServerUrl = true) => {
//   let finalUrl = url;
//   if (appendServerUrl)
//     finalUrl = `${config.apiUrl}${url}`;
//
//   return fetch(finalUrl, {
//     method,
//     headers: prepareHeaders(dataType),
//     body: data ? prepareBody[dataType](data) : undefined
//   })
// };
//
// export const SuperFetch = {};
// ['get', 'post', 'patch', 'put', 'delete'].forEach(method => {
//   SuperFetch[method] = base.bind(null, method);
// });
//
