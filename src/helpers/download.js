// import { SuperFetch } from "./superFetch";
// //Analytics
// import Analytics from "../analytics";
// import { AUTH_SERVICE, AUTH_STORE } from "../redux/auth/constants";
//
//
// export const downloadExcelFile = (config) => {
//   const {url, fileName, appendServerUrl, setLoading} = config;
//
//   SuperFetch.get(url, null, "json", appendServerUrl).then(response => {
//     if (AUTH_STORE.getToken()) {
//       return response.blob();
//     } else {
//       AUTH_SERVICE.validateResponse(response)
//     }
//
//   }).then(blob => {
//     if (blob) {
//       Analytics.dispatchGAEvent({
//         category: Analytics.getEventCategory().Download,
//         action: "Download Excel File",
//         label: `Downloaded: ${fileName}`
//       })
//       const a = document.createElement("a");
//       a.href = window.URL.createObjectURL(blob);
//       a.setAttribute("download", fileName);
//       a.click();
//       if (setLoading)
//         setLoading(false)
//     }
//   })
// };
//
// export const downloadCsvFile = (config) => {
//   const {file, title} = config;
//   const element = document.createElement('a');
//   const blob = new Blob([file], {type: 'text/csv;charset=utf-8;'});
//
//   Analytics.dispatchGAEvent({
//     category: Analytics.getEventCategory().Download,
//     action: "Download CSV File",
//     label: `Downloaded: ${title}`
//   })
//
//   element.href = URL.createObjectURL(blob);
//   element.setAttribute('download', `${title || "File"}.csv`);
//   element.click();
// }
//
// export const downloadFile = (config) => {
//   const {url, fileName} = config;
//
//   var a = document.createElement("a");
//   a.href = url;
//   a.target = "_blank";
//   a.setAttribute("download", fileName);
//   document.body.appendChild(a);
//   a.click();
// };