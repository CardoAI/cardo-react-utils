class Controller {

  constructor(client) {
    this.calls = {}
    this.client = client;
  }

  cancelPreviousCall = (url) => {

    if (!this.calls.hasOwnProperty(url))
      return;

    const source = this.calls[url];

    if (typeof source !== typeof undefined)
      source.cancel("Operation canceled due to new request.");
  }

  removeSource = (url) => {
    delete this.calls[url];
  }

  createSource = (url) => {
    this.calls[url] = this.client.CancelToken.source();
  }

  getSource = (url) => {
    return this.calls[url];
  }
}

export default Controller;

