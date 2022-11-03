import React  from 'react';
import createField from "../field_builder";
import { lazyField, enhancedArray, enhancedObject } from "./enhanced_data_types";
import { formForEach, formMap, isFile } from "../helpers";

//#region GET VALUES

//#region JSON VALUES

interface FlatValue {
  key: string | number,
  value: any,
  parents: (string | number)[]
}

const isCurrentParentArray = (nextParent: string | number) => {
  return typeof nextParent === 'number';
}

const getValuesAsJson = (form: any, filter?: (value: any, name: string) => boolean) => {
  // put all fields (with its key and parents) on an array: { key: string, value: any, parents: string[] }
  const flatValues: FlatValue[] = [];

  formForEach(form, (field: any, key: string | number, parents: (string | number)[]) => {
    if (typeof filter === 'function' && !filter(field.value, String(field.name))) return;
    flatValues.push({ key, value: field.value, parents });
  });

  // loop through flatValues and add fields to the result by their parents as path.
  const result = Array.isArray(form) ? [] : {};
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

//#endregion

//#region FORM DATA

const dot = (curr: string) => {
  return curr === '' ? '' : '.';
}

const arrayIndicator = (nextParent: string | number) => {
  return typeof nextParent === 'number' ? '[]' : ''
}

const getPath = (key: string | number, parents: (string | number)[]): string => {
  let path = '';

  for (let i = 0; i < parents.length; i++) {
    if (typeof parents[i] === 'number') continue;
    path += `${dot(path)}${parents[i]}${arrayIndicator(parents[i + 1])}`;
  }

  return `${path}${dot(path)}${key}`;
}

const getValuesAsFormData = (form: any, filter?: (value: any, name: string) => boolean) => {
  const formData = new FormData();

  formForEach(form, (field: any, key: string | number, parents: (string | number)[]) => {
    if (typeof filter === 'function' && !filter(field.value, String(field.key)))
      return;

    if (isFile(field.value))
      formData.append(getPath(key, parents), field.value, field.value.name);
    else
      formData.append(getPath(key, parents), field.value);
  });

  return formData;
}

//#endregion

//#endregion

//#region VALIDATE FORM

const validateAllFields = async (form: any, allValues: any, updateState: () => void): Promise<boolean> => {
  const fields: any[] = []
  const validations: Promise<void>[] = [];

  formForEach(form, (field: any) => {
    fields.push(field);
    validations.push(field.validate(allValues, updateState));
  });

  await Promise.all(validations);

  for (const f of fields) {
    if (f.error !== undefined)
      return false;
  }

  return true;
}

//#endregion

//#region BUILD FIELDS

const newEnhancedObject = (updateState: () => void) => {
  const configToFieldsFn = (config: any, initialValues: any) => initFields(config, initialValues, updateState);
  return enhancedObject(configToFieldsFn, updateState);
}

const newEnhancedArray = (model: any, updateState: () => void) => {
  const modelToFieldsFn = () => initFields(model, undefined, updateState);
  return enhancedArray(modelToFieldsFn, updateState);
}

const buildFields = (configFields: any, initValues: any, updateState: () => void) => {
  const result: any = newEnhancedObject(updateState);

  for (const key in configFields) {
    const config = configFields[key];
    const initialValue = !!initValues ? initValues[key] : undefined;

    if (config.isObjectType) {
      result[key] = buildFields(config.fields, initialValue, updateState);
    } else if (config.isArrayType) {
      result[key] = newEnhancedArray(config.model, updateState);
      if (Array.isArray(initialValue)) {
        for (const value of initialValue) {
          result[key].push(buildFields(config.model, value, updateState));
        }
      }
    } else {
      config.configValue = initialValue;
      result[key] = createField(key, config);
    }
  }

  return result;
}

const initFields = (shape: any, initialValues: any, updateState: () => void): any => {
  const finalConfig: any = typeof shape === 'function' ? shape() : shape;
  const finalInitialValues: any = typeof initialValues === 'function' ? initialValues() : initialValues;

  if (finalConfig.isObjectType) {
    return buildFields(finalConfig.fields, finalInitialValues, updateState);
  } else if (finalConfig.isArrayType) {
    return newEnhancedArray(finalConfig.model, updateState);
  } else {
    return buildFields(finalConfig, finalInitialValues, updateState);
  }
}

const useRef = <T>(fn: () => T): React.MutableRefObject<T | null> => {
  const ref = React.useRef<T | null>(null);
  if (ref.current === null) ref.current = fn();
  return ref;
}

//#endregion

const useLazyForm = (shape: any, initialValues?: any) => {
  const formRef = useRef<any>(() => initFields(shape, initialValues, _updateState));
  const [formState, setFormState] = React.useState<any>(_mapRefToState);

  function _updateState(): void {
    setFormState(_mapRefToState());
  }

  function _mapRefToState(): any {
    return formMap(formRef.current, (field: any) => lazyField(field, getValues, _updateState));
  }

  function getValues(params?: { filter?: (value: any, name: string) => boolean, dataType?: 'json' | 'formData' }): any {
    if (params?.dataType === 'formData')
      return getValuesAsFormData(formRef.current, params?.filter);
    return getValuesAsJson(formRef.current, params?.filter);
  }

  async function validateForm(): Promise<boolean> {
    const allValues = getValues();
    const isValid: boolean = await validateAllFields(formRef.current, allValues, _updateState);
    _updateState();
    return isValid;
  }

  return {
    fields: formState,
    getValues,
    validateForm,
  };
};

export default useLazyForm;
