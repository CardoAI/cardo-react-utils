import BaseConfig from "./base_config";
import { DATA_TYPES, INPUT_TYPES } from "../helpers";

class CheckboxConfig extends BaseConfig {
  configOptions: any;
  configIsGroup: boolean = false;

  constructor(label?: string) {
    super(INPUT_TYPES.CHECKBOX, label);
    this.configDataType = DATA_TYPES.BOOLEAN;
  }

  dataType(type: string) {
    if (typeof type === 'string' && !this.configIsGroup)
      this.configDataType = type;

    return this;
  }

  options(value: any) {
    this.configOptions = value;
    return this;
  }

  isGroup(value: boolean = true) {
    if (typeof value === 'boolean') {
      this.configIsGroup = value;
      if (value)
        this.configDataType = DATA_TYPES.ARRAY;
    }

    return this;
  }
}

export default CheckboxConfig;
