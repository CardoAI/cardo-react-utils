import {IClientDownloadOptions, IClientDownloadProps} from "./interfaces";
import {AxiosRequestConfig} from "axios";

declare global {
  interface Navigator {
    msSaveBlob: (blob: any, defaultName?: string) => any,
  }
}

const onDownload = (data: any, filename: string, mime?: any, bom?: any) => {

  let blobData = (typeof bom !== 'undefined') ? [bom, data] : [data]
  let blob = new Blob(blobData, {type: mime || 'application/octet-stream'});

  if (typeof window.navigator.msSaveBlob !== 'undefined') {
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
     setLoading,
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
        if (!client) return;
        setLoading && setLoading(true);
        const params: AxiosRequestConfig = {
          ...rest,
          url: url,
          method: 'GET',
          responseType: 'blob',
          headers: {
            ...headers,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        };

        if (baseURL)
          params.baseURL = baseURL;

        client(params)
          .then((data: any) => onDownload(data, filename))
          .finally(() => onFinish && onFinish());

      } catch (e) {
        onError && onError(e)
      } finally {
        setLoading && setLoading(false);
      }
    }
  }

export default createClientDownload;
