import {IClientDownloadOptions, IClientDownloadParams, IClientDownloadProps} from "../interfaces";

const onDownload = (data: any, filename: string, mime?: any, bom?: any) => {

    let blobData = (typeof bom !== 'undefined') ? [bom, data] : [data]
    let blob = new Blob(blobData, {type: mime || 'application/octet-stream'});
    // @ts-ignore
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
        // IE workaround for "HTML7007: One or more blob URLs were
        // revoked by closing the blob for which they were created.
        // These URLs will no longer resolve as the data backing
        // the URL has been freed."
        // @ts-ignore
        window.navigator.msSaveBlob(blob, filename);
    } else {
        let blobURL = (window.URL && window.URL.createObjectURL) ? window.URL.createObjectURL(blob) : window.webkitURL.createObjectURL(blob);
        let tempLink = document.createElement('a');
        tempLink.style.display = 'none';
        tempLink.href = blobURL;
        tempLink.setAttribute('download', filename);

        // Safari thinks _blank anchor are pop ups. We only want to set _blank
        // target if the browser does not support the HTML5 download attribute.
        // This allows you to download files in desktop safari if pop up blocking
        // is enabled.
        if (typeof tempLink.download === 'undefined') {
            tempLink.setAttribute('target', '_blank');
        }

        document.body.appendChild(tempLink);
        tempLink.click();

        // Fixes "webkit blob resource error 1"
        setTimeout(function () {
            document.body.removeChild(tempLink);
            window.URL.revokeObjectURL(blobURL);
        }, 200)
    }
}

export default ({client, baseURL}:IClientDownloadOptions) =>
    ({
         url,
         headers,
         filename,
         onFinish,
         onError,
         link = false,
         ...rest
     }:IClientDownloadProps) => {

        if (link) {
            let linkRef = document.createElement("a");
            linkRef.setAttribute('download', filename);
            linkRef.href = url;
            document.body.appendChild(linkRef);
            linkRef.click();
            linkRef.remove();
        } else {
            try {

                const params:IClientDownloadParams = {
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