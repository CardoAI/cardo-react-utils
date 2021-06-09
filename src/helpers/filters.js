
export function filterByAttr(data, attr, value) {
  return data.filter(rec => rec[attr] === value);
}