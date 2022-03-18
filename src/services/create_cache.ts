export default () => {

  let cache: any = {};
  let storage: any = {};

  cache.get = (key: string) => {
    if (!storage.hasOwnProperty(key)) return null;
    return storage[key].value;
  };

  cache.set = (key: string, value: any, time: number) => {
    const previous: any = storage[key];
    if (previous && previous.timeout) clearTimeout(previous.timeout);

    let expire: boolean | number = false;
    if (time) expire = time + (new Date()).getTime();
    const element: any = { value, expire };

    if (expire) element.timeout = setTimeout(() => cache.remove(key), time);
    storage[key] = element;
  };

  cache.remove = (key: string) => {
    if (!cache.hasOwnProperty(key)) return;
    if (cache[key].timeout) clearTimeout(cache[key].timeout);
    delete storage[key];
  };

  cache.clear = () => {
    for (let key in storage) {
      if (storage[key].timeout)
        clearTimeout(storage[key].timeout);
    }
    storage = {};
  };

  cache.keys = () => {
    return Object.keys(storage);
  };

  cache.count = () => {
    return Object.keys(storage).length;
  };

  cache.includes = (key: string) => {
    return storage.hasOwnProperty(key)
  }

  return cache;
}
