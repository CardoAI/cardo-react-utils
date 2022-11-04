import React  from 'react';
import createField from "../field_builder";
import { lazyField, enhancedArray, enhancedObject, formForEach, formMap, flatValuesToTree, FlatValue } from "../helpers";

//#region GET VALUES

const getFormValues = (form: any, filter?: (value: any, name: string) => boolean) => {
  // put all fields (with its key and parents) on an array: { key: string, value: any, parents: string[] }
  const flatValues: FlatValue[] = [];

  formForEach(form, (field: any, key: string | number, parents: (string | number)[]) => {
    if (typeof filter === 'function' && !filter(field.value, String(field.name))) return;
    flatValues.push({ key, value: field.value, parents });
  });

  return flatValuesToTree(flatValues, Array.isArray(form));
}

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

  function getValues(filter?: (value: any, name: string) => boolean): any {
    return getFormValues(formRef.current, filter);
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
