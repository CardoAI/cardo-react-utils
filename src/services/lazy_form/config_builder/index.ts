import DateConfig from "./date_config";
import FileConfig from "./file_config";
import RadioConfig from "./radio_config";
import EmailConfig from "./email_config";
import StringConfig from "./string_config";
import NumberConfig from "./number_config";
import SelectConfig from "./select_config";
import CheckboxConfig from "./checkbox_config";
import PasswordConfig from "./password_config";
import MultiSelectConfig from "./multiselect_config";

export const date = (label?: string) => new DateConfig(label);
export const file = (label?: string) => new FileConfig(label);
export const radio = (label?: string) => new RadioConfig(label);
export const email = (label?: string) => new EmailConfig(label);
export const string = (label?: string) => new StringConfig(label);
export const number = (label?: string) => new NumberConfig(label);
export const select = (label?: string) => new SelectConfig(label);
export const checkbox = (label?: string) => new CheckboxConfig(label);
export const password = (label?: string) => new PasswordConfig(label);
export const multiselect = (label?: string) => new MultiSelectConfig(label);

interface LazyFormArray {
  isArrayType: boolean,
  model: any
}

interface LazyFormObject {
  isObjectType: boolean,
  fields: any,
}

export const array = (model: any): LazyFormArray => ({ isArrayType: true, model });
export const object = (fields: any): LazyFormObject => ({ isObjectType: true, fields });
