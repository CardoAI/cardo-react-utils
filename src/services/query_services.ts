export const INVALIDATE_QUERY_KEY = 'invalidateQuery';

const invalidateQuery = (key: string) => {
  window.postMessage({
    type: INVALIDATE_QUERY_KEY,
    key: key,
  });
}

export default {
  invalidateQuery,
};
