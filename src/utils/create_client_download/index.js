const onDownload = (data, filename, mime, bom) => {

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

    // Fixes "webkit blob resource error 1"
    setTimeout(function () {
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(blobURL);
    }, 200)
  }
}

export default ({client, baseURL}) =>
  ({
     url,
     headers,
     filename,
     onFinish,
     onError,
     link = false,
     ...rest
   }) => {

    if (link) {
      let linkRef = document.createElement("a");
      linkRef.setAttribute('download', filename);
      linkRef.href = url;
      document.body.appendChild(linkRef);
      linkRef.click();
      linkRef.remove();
    } else {
      try {

        const params = {
          ...rest,
          method: 'GET',
          responseType: 'blob',
          headers: {...headers},
        };

        if (baseURL)
          params.baseURL = baseURL;

        client(params)
          .then(data => onDownload(data, filename))
          .finally(() => onFinish && onFinish());

      } catch (e) {
        onError && onError(e)
      }
    }
  }
