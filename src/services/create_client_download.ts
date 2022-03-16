import {IClientDownloadOptions, IClientDownloadParams, IClientDownloadProps} from "./interfaces";

const onDownload = (data: any, filename: string, mime?: any, bom?: any) => {

  let blobData = (typeof bom !== 'undefined') ? [bom, data] : [data]
  let blob = new Blob(blobData, {type: mime || 'application/octet-stream'});
  // @ts-ignore
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    // @ts-ignore
    window.navigator.msSaveBlob(blob, filename);
  } else {
    let blobURL = (window.URL && window.URL.createObjectURL) ? window.URL.createObjectURL(blob) : window.webkitURL.createObjectURL(blob);
    let tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href = blobURL;
    tempLink.setAttribute('download', filename);
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank');
    }
    document.body.appendChild(tempLink);
    tempLink.click();

    setTimeout(function () {
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(blobURL);
    }, 200)
  }
}

const createClientDownload = ({client, baseURL}: IClientDownloadOptions) =>
  ({
     url,
     headers,
     filename,
     onFinish,
     onError,
     link = false,
     ...rest
   }: IClientDownloadProps) => {

    if (link) {
      let linkRef = document.createElement("a");
      linkRef.setAttribute('download', filename);
      linkRef.href = url;
      document.body.appendChild(linkRef);
      linkRef.click();
      linkRef.remove();
    } else {
      try {

        const params: IClientDownloadParams = {
          ...rest,
          method: 'GET',
          responseType: 'blob',
          headers: {...headers},
        };

        if (baseURL)
          params.baseURL = baseURL;

        client(params)
          .then((data: any) => onDownload(data, filename))
          .finally(() => onFinish && onFinish());

      } catch (e) {
        onError && onError(e)
      }
    }
  }

export default createClientDownload;