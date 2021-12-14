import {IClient} from "../interfaces";

class Controller {
  calls: any;
  client: any;

  constructor(client:IClient) {
    this.calls = {}
    this.client = client;
  }

  cancelPreviousCall = (url:string):void => {

    if (!this.calls.hasOwnProperty(url))
      return;

    const source = this.calls[url];

    if (typeof source !== typeof undefined)
      source.cancel("Operation canceled due to new request.");
  }

  removeSource = (url:string):void => {
    delete this.calls[url];
  }

  createSource = (url:string):void => {
    this.calls[url] = this.client.CancelToken.source();
  }

  getSource = (url:string) :any=> {
    return this.calls[url];
  }
}

export default Controller;