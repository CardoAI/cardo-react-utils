const createClientController = ({client}: any) => {

  const calls: any = {};

  const cancelPreviousCall = (url: string): void => {

    if (!calls.hasOwnProperty(url))
      return;

    const source = calls[url];

    if (typeof source !== typeof undefined)
      source.cancel("Operation canceled due to new request.");
  }

  const removeSource = (url: string): void => {
    delete calls[url];
  }

  const createSource = (url: string): void => {
    calls[url] = client.CancelToken.source();
  }

  const getSource = (url: string): any => {
    return calls[url];
  }

  return {
    calls,
    getSource,
    createSource,
    removeSource,
    cancelPreviousCall
  }
}

export default createClientController;