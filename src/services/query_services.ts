const invalidateQuery = (key: string) => {
  window.postMessage({ key: key });
}

export default {
  invalidateQuery,
};
