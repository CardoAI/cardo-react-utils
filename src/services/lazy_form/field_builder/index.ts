import { INPUT_TYPES } from "../helpers";
import DateField from "./date_field";
import FileField from "./file_field";
import RadioField from "./radio_field";
import EmailField from "./email_field";
import StringField from "./string_field";
import NumberField from "./number_field";
import SelectField from "./select_field";
import CheckboxField from "./checkbox_field";
import PasswordField from "./password_field";
import MultiselectField from "./multiselect_field";

const FIELD_TYPES = {
  [INPUT_TYPES.DATE]: (name: string, fieldConfig: any) => new DateField(name, fieldConfig),
  [INPUT_TYPES.FILE]: (name: string, fieldConfig: any) => new FileField(name, fieldConfig),
  [INPUT_TYPES.RADIO]: (name: string, fieldConfig: any) => new RadioField(name, fieldConfig),
  [INPUT_TYPES.EMAIL]: (name: string, fieldConfig: any) => new EmailField(name, fieldConfig),
  [INPUT_TYPES.STRING]: (name: string, fieldConfig: any) => new StringField(name, fieldConfig),
  [INPUT_TYPES.NUMBER]: (name: string, fieldConfig: any) => new NumberField(name, fieldConfig),
  [INPUT_TYPES.SELECT]: (name: string, fieldConfig: any) => new SelectField(name, fieldConfig),
  [INPUT_TYPES.CHECKBOX]: (name: string, fieldConfig: any) => new CheckboxField(name, fieldConfig),
  [INPUT_TYPES.PASSWORD]: (name: string, fieldConfig: any) => new PasswordField(name, fieldConfig),
  [INPUT_TYPES.MULTISELECT]: (name: string, fieldConfig: any) => new MultiselectField(name, fieldConfig),
}

const createField = (name: string, fieldConfig: any) => {
  const createNewFieldFn = FIELD_TYPES[fieldConfig.configInputType];
  return createNewFieldFn(name, fieldConfig);
}

export default createField;
