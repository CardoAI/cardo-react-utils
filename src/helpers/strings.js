//External Libraries
import FormatText from 'react-nl2br';
//Other Formatters
import { hasValue } from "./utility";

export const convertToSnakeCase = (string) => {
  return string.charAt(0).toLowerCase() + string.slice(1) // lowercase the first character
    .replace(/\W+/g, " ") // Remove all excess white space and replace & , . etc.
    .replace(/([a-z])([A-Z])([a-z])/g, "$1 $2$3") // Put a space at the position of a camelCase -> camel Case
    .split(/\B(?=[A-Z]{2,})/) // Now split the multi-upper cases customerID -> customer,ID
    .join(' ') // And join back with spaces.
    .split(' ') // Split all the spaces again, this time we're fully converted
    .join('_') // And finally snake_case things up
    .toLowerCase() // With a nice lower case
};

export const replaceNonAlphaNumericChars = (str) => {
  if (str)
    return str.replace(/[^A-Z0-9]+/ig, "");
  return ""
};

export const Text = (str) => {
  return FormatText(str);
};

export function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.substring(1);
}

export function humanString(string) {
  if (!hasValue(string))
    return "";
  const words = string.match(/[A-Za-z][a-z]*/g) || [];
  return words.map(capitalize).join(" ");
}

export function prepend(label, string, separator = "_") {
  return `${label}${separator}${string}`
}

export function stringify(value) {
  if (!value)
    return value;

  return value.toString();
}
