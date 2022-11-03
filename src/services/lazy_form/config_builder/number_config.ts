import BaseConfig from "./base_config";
import { DATA_TYPES, INPUT_TYPES } from "../helpers";

class NumberConfig extends BaseConfig {
  configMin: number | undefined;
  configMax: number | undefined;

  constructor(label?: string) {
    super(INPUT_TYPES.NUMBER, label);
    this.configDataType = DATA_TYPES.NUMBER;
  }

  min(value: number) {
    if (typeof value === 'number')
      this.configMin = value;

    return this;
  }

  max(value: number) {
    if (typeof value === 'number')
      this.configMax = value;

    return this;
  }
}

export default NumberConfig;
