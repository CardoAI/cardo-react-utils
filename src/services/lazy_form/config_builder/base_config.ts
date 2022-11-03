import { INPUT_TYPES } from "../helpers";

class BaseConfig {
  configExtra: any;
  configRequired: boolean = false;
  configValue: any | undefined = undefined;
  configLabel: string | undefined = undefined;
  configDataType: string = INPUT_TYPES.STRING;
  configInputType: string = INPUT_TYPES.STRING;
  configRequiredMessage: string | undefined = undefined;
  configInputValidations: ((value: any) => (string | undefined))[] = [];
  configCustomValidations: ((value: any, allValues: any) => (Promise<string | undefined> | string | undefined))[] = [];

  constructor(inputType: string, label?: string) {
    this.configInputType = inputType;

    if (typeof label === 'string')
      this.configLabel = label;
  }

  required(message?: string) {
    this.configRequired = true;
    if (typeof message === 'string')
      this.configRequiredMessage = message;

    return this;
  }

  addRule(customValidation: (value: any, allValues: any) => (Promise<string | undefined> | string | undefined)) {
    if (typeof customValidation === 'function')
      this.configCustomValidations.push(customValidation);

    return this;
  }

  extra(value: any) {
    this.configExtra = value;
    return this;
  }
}

export default BaseConfig;
