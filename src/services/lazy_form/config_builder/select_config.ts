import BaseConfig from "./base_config";
import { DATA_TYPES, INPUT_TYPES } from "../helpers";

class SelectConfig extends BaseConfig {
  configOptions: any;
  configOptionsUrl: string | undefined;

  constructor(label?: string) {
    super(INPUT_TYPES.SELECT, label);
    this.configDataType = DATA_TYPES.STRING;
  }

  dataType(type: string) {
    if (typeof type === 'string')
      this.configDataType = type;

    return this;
  }

  options(value: any) {
    this.configOptions = value;
    return this;
  }

  optionsUrl(url: string) {
    if (typeof url === 'string')
      this.configOptionsUrl = url;

    return this;
  }
}

export default SelectConfig;
