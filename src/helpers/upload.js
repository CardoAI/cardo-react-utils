export function prepareExtensionsForInput(extensions) {
  let str = "";
  extensions.forEach(extension => {
    str += `.${extension} `;
  })
  return str;
}