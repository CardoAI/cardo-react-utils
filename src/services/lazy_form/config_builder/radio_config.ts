import BaseConfig from "./base_config";
import { DATA_TYPES, INPUT_TYPES } from "../helpers";

class RadioConfig extends BaseConfig {
  configOptions: any;
  configIsMultiselect: boolean = false;

  constructor(label?: string) {
    super(INPUT_TYPES.RADIO, label);
    this.configDataType = DATA_TYPES.STRING;
  }

  dataType(type: string) {
    if (typeof type === 'string' && !this.configIsMultiselect)
      this.configDataType = type;

    return this;
  }

  options(values: any) {
    this.configOptions = values;
    return this;
  }

  isMultiselect(value: boolean = true) {
    if (typeof value === 'boolean') {
      this.configIsMultiselect = value;

      if (value)
        this.configDataType = DATA_TYPES.ARRAY;
    }

    return this;
  }
}

export default RadioConfig;
