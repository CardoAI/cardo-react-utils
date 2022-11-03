import BaseConfig from "./base_config";
import { DATA_TYPES, INPUT_TYPES } from "../helpers";
import { ERROR_MESSAGES } from "../helpers";

class EmailConfig extends BaseConfig {
  configMaxLength: number | undefined;

  constructor(label?: string) {
    super(INPUT_TYPES.EMAIL, label);
    this.configDataType = DATA_TYPES.STRING;

    this.configInputValidations.push(fieldValue => {
      const result = fieldValue.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      return result === null ? ERROR_MESSAGES.INVALID_EMAIL : undefined;
    });
  }

  maxLength(value: number) {
    if (typeof value === 'number') {
      this.configMaxLength = value;
    }

    return this;
  }
}

export default EmailConfig;
