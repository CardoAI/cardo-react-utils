import BaseConfig from "./base_config";
import { DATA_TYPES, INPUT_TYPES } from "../helpers";

class StringConfig extends BaseConfig {
  configMaxLength: number | undefined;

  constructor(label?: string) {
    super(INPUT_TYPES.STRING, label);
    this.configDataType = DATA_TYPES.STRING;
  }

  maxLength(value: number) {
    if (typeof value === 'number')
      this.configMaxLength = value;

    return this;
  }
}

export default StringConfig;
