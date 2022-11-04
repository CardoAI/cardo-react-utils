import { isField } from "./type_checkers";
import { cloneEnhancedArr, cloneEnhancedObj } from "./enhanced_data_types";

export const formMap = (ojb: any, fieldCallback: (field: any) => any) => {
  if (isField(ojb)) {
    return fieldCallback(ojb);
  }

  if (Array.isArray(ojb)) {
    const resultArray: any[] = cloneEnhancedArr(ojb);
    for (const element of ojb)
      resultArray.push(formMap(element, fieldCallback));
    return resultArray;
  }

  const resultObj: any = cloneEnhancedObj(ojb);
  for (const key in ojb)
    resultObj[key] = formMap(ojb[key], fieldCallback);
  return resultObj;
}

const getUpdatedParents = (key: string | number, parents: (string | number)[]) => {
  return key === '' ? [...parents] : [...parents, key];
}

export const formForEach = (
  obj: any,
  fieldCallback: (value: any, key: string | number, parents: (string | number)[]) => any,
  key: string | number = '',
  parents: (string | number)[] = []
) => {
  if (isField(obj)) {
    fieldCallback(obj, key, parents);
  } else if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++)
      formForEach(obj[i], fieldCallback, i, getUpdatedParents(key, parents));
  } else {
    for (const propKey in obj)
      formForEach(obj[propKey], fieldCallback, propKey, getUpdatedParents(key, parents));
  }
}

export interface FlatValue {
  key: string | number,
  value: any,
  parents: (string | number)[]
}

const isCurrentParentArray = (nextParent: string | number) => {
  return typeof nextParent === 'number';
}

export const flatValuesToTree = (flatValues: FlatValue[], isArray: boolean) => {
  // loop through flatValues and add fields to the result by their parents as path.
  const result = isArray ? [] : {};
  let pointer: any = result;

  // we need this to store array keys so that the result doesn't have empty values on arrays: [accumulatedParents]: 0
  const arrayKeys: any = {};

  for (const field of flatValues) {
    let accumulatedParents = ''; // this will serve as array element id (instead of index number)

    for (let idx = 0; idx < field.parents.length; idx++) {
      let currentParent = field.parents[idx];
      accumulatedParents += currentParent;

      // if key is array index, get the correct key from arrayKeys object
      if (typeof currentParent === 'number') {
        if (arrayKeys[accumulatedParents] === undefined) arrayKeys[accumulatedParents] = pointer.length;
        currentParent = arrayKeys[accumulatedParents];
      }

      // create path if it doesn't exist
      if (pointer[currentParent] === undefined)
        pointer[currentParent] = isCurrentParentArray(field.parents[idx + 1]) ? [] : {};

      pointer = pointer[currentParent]; // shift pointer to next level
    }

    pointer[field.key] = field.value; // assign key and value
    pointer = result; // set pointer back to root
  }

  return result;
}
