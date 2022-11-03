import { isField } from "./type_checkers";

const cloneEnhancedArr = (enhancedArr: any) => {
  const arr: any[] = [];
  Object.defineProperty(arr, 'addField', { enumerable: false, value: enhancedArr.addField });
  Object.defineProperty(arr, 'removeField', { enumerable: false, value: enhancedArr.removeField });
  return arr;
}

const cloneEnhancedObj = (enhancedObj: any) => {
  const obj: any = {};
  Object.defineProperty(obj, 'createField', { enumerable: false, value: enhancedObj.createField });
  Object.defineProperty(obj, 'deleteField', { enumerable: false, value: enhancedObj.deleteField });
  return obj;
}

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
