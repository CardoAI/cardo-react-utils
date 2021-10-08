//External Libraries
import clone from "clone";

export function hasValue(item) {
  return item !== null && item !== undefined;
}

export function validateValue(value, format, callbackUI = " - ") {
  const check = value !== undefined && value !== null && value !== "";
  return check ? format ? format(value) : value : callbackUI
}

export const stopPropagation = (event) => event.stopPropagation();

/*---Objects---*/

/*Check if Array or Object is Empty*/
export function isEmpty(object) {
  if (!hasValue(object))
    return true;
  if (Array.isArray(object))
    return object.length === 0;
  else
    return Object.keys(object).length === 0;
}

/*Check if object has keys*/
export function isEmptyObject(obj) {
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop))
      return false;
  }
  return true;
}

/**
 * Get an object with the differences between two objects
 * @param oldObject
 * @param newObject
 * @param skipKeys - An array of keys that should not be compared
 * @returns {object} - An object containing the properties of newObject that are different from oldObject
 *                     or false if no differences were found
 */
export function getDifferences(oldObject, newObject, skipKeys = []) {
  let difference = {};

  Object.keys(oldObject).forEach(key => {
    if (!skipKeys.includes(key) && JSON.stringify(oldObject[key]) !== JSON.stringify(newObject[key]))
      difference[key] = newObject[key]
  });

  return isEmpty(Object.keys(difference)) ? false : difference;
}

/**
 * Assign a value to an inner object or initialize it if not defined
 */
export function assign(object, attr, valuesObj) {
  if (object[attr])
    Object.assign(object[attr], valuesObj);
  else
    object[attr] = valuesObj;
}


/*---Arrays---*/

/**
 * Copy Arrays
 */
export const copyArray = (records) => {
  return clone(records)
}

/**
 * Check if Arrays are Equal
 */
export function equalArrays(array1, array2) {
  array1.sort();
  array2.sort();
  if (array1.length !== array2.length)
    return false;
  for (let index = 0; index < array1.length; index++)
    if (array1[index] !== array2[index])
      return false;
  return true;
}

export function splitRecords(data, maxEntries) {
  let allRecords = [];
  let tmpRecords = [];
  let initialIndex = null;
  let availableEntries = null;
  data.forEach((entry, index) => {
    if (initialIndex === null) {
      initialIndex = index;
      availableEntries = maxEntries;
      while (initialIndex + availableEntries > data.length) {
        availableEntries--;
      }
    }
    tmpRecords.push(entry);
    if (tmpRecords.length === availableEntries) {
      allRecords.push(tmpRecords);
      tmpRecords = [];
      initialIndex = null;
    }
  });
  return allRecords;
}

export function getArrayDifferences(oldArray, newArray, idAttr = 'id', skipKeys = [],) {
  const differences = [];

  oldArray.forEach((element, index) => {
    const difference = getDifferences(element, newArray[index], skipKeys);
    if (difference)
      differences.push({[idAttr]: element[idAttr], ...difference});
  });

  return isEmpty(differences) ? false : differences;
}

export function removeFromArray(array, element) {
  array.splice(array.indexOf(element), 1);
}

/**
 * Get Last Element in an Array
 */
export function last(array) {
  return array[array.length - 1]
}

export function pushToInnerArray(object, arrayAttr, value) {
  if (object[arrayAttr])
    object[arrayAttr].push(value);
  else
    object[arrayAttr] = [value]
}

export function chunkArray(input, chunk = 2) {
  return input.reduce((resultArray, item, index) => {
    const newRecord = clone(item);
    const chunkIndex = Math.floor(index / chunk)

    if (!resultArray[chunkIndex])
      resultArray[chunkIndex] = [] // start a new chunk

    resultArray[chunkIndex].push(newRecord)

    return resultArray
  }, [])
}

export function range(start, end, step = 1) {
  const array = [];
  let current = start;
  while (current < end) {
    array.push(current);
    current += step;
  }
  return array;
}

export function getRange(range, type) {
  return type === 'min' ? range[0] : range[1];
}

export function sort(values, key) {
  if (key) {
    values.sort((a, b) => +b[key] - +a[key]);
  } else {
    values.sort((a, b) => +b - +a);
  }
}

export function sum(values, key) {
  let s, i, n;

  for (s = 0, i = 0, n = values.length; i < n; ++i) {
    s += key ? +values[i][key] : +values[i];
  }

  return s;
}

export const sortRecords = (key, reverse) => {
  const moveSmaller = reverse ? 1 : -1;
  const moveLarger = reverse ? -1 : 1;

  return (a, b) => {
    // equal items sort equally
    if (a[key] === b[key])
      return 0;

    if (a[key] < b[key]) {
      return moveSmaller;
    }
    if (a[key] > b[key]) {
      return moveLarger;
    }
    return 0;
  };
};