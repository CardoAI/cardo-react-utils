export const lazyField = (
  fieldRef: any,
  getValues: { [p: string]: any } | (() => any),
  updateState: () => void
) => {

  const resultStateField = { ...fieldRef };

  delete resultStateField.requiredMessage;
  delete resultStateField.inputValidations;
  delete resultStateField.customValidations;

  resultStateField.setValue = (newValue: any) => {
    fieldRef.setValue(newValue);
    updateState();
  }

  resultStateField.validate = async () => {
    await fieldRef.validate(getValues, updateState);
    updateState();
  }

  resultStateField.setError = (message: string) => {
    fieldRef.error = message;
    updateState();
  }

  resultStateField.setExtra = (newExtra: any) => {
    fieldRef.extra = newExtra;
    updateState();
  }

  resultStateField.clearValue = () => {
    fieldRef.value = undefined;
    updateState();
  }

  resultStateField.clearError = () => {
    fieldRef.error = undefined;
    updateState();
  }

  return resultStateField;
}

export const enhancedArray = (
  modelToFieldsFn: () => any,
  updateState: () => void
) => {

  const array: any[] = [];

  Object.defineProperty(array, 'addField', {
    enumerable: false,
    value: () => {
      array.push(modelToFieldsFn());
      updateState();
    },
  });

  Object.defineProperty(array, 'removeField', {
    enumerable: false,
    value: (index: number) => {
      array.splice(index, 1);
      updateState();
    },
  });

  return array;
}

export const enhancedObject = (
  configToFieldsFn: (configField: any, initialValues: any) => any,
  updateState: () => void
) => {

  const obj: any = {};

  Object.defineProperty(obj, 'createField', {
    enumerable: false,
    value: (fieldConfig: any, initialValues: any) => {
      Object.keys(fieldConfig).forEach(key => obj[key] = configToFieldsFn(fieldConfig[key], initialValues));
      updateState();
    },
  });

  Object.defineProperty(obj, 'deleteField', {
    enumerable: false,
    value: (key: string) => {
      delete obj[key];
      updateState();
    },
  });

  return obj;
}

export const cloneEnhancedArr = (enhancedArr: any) => {
  const arr: any[] = [];
  Object.defineProperty(arr, 'addField', { enumerable: false, value: enhancedArr.addField });
  Object.defineProperty(arr, 'removeField', { enumerable: false, value: enhancedArr.removeField });
  return arr;
}

export const cloneEnhancedObj = (enhancedObj: any) => {
  const obj: any = {};
  Object.defineProperty(obj, 'createField', { enumerable: false, value: enhancedObj.createField });
  Object.defineProperty(obj, 'deleteField', { enumerable: false, value: enhancedObj.deleteField });
  return obj;
}
