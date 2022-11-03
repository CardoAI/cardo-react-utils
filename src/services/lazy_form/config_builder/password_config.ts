import BaseConfig from "./base_config";
import { DATA_TYPES, INPUT_TYPES } from "../helpers";

class PasswordConfig extends BaseConfig {
  configMinLength: number | undefined;
  configMaxLength: number | undefined;

  constructor(label?: string) {
    super(INPUT_TYPES.PASSWORD, label);
    this.configDataType = DATA_TYPES.STRING;
  }

  minLength(value: number) {
    if (typeof value === 'number')
      this.configMinLength = value;

    return this;
  }

  maxLength(value: number) {
    if (typeof value === 'number')
      this.configMaxLength = value;

    return this;
  }
}

export default PasswordConfig;
