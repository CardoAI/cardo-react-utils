export const isField = (field: any) => {
  return field.hasOwnProperty('name')
    && field.hasOwnProperty('value')
    && field.hasOwnProperty('error')
    && field.hasOwnProperty('setValue')
    && field.hasOwnProperty('validate');
}

export const isEmpty = (value: any): boolean => {
  return value === undefined || value === null || value === '';
}

export const isFile = (fieldVal: any) => {
  return fieldVal?.constructor === File;
}
