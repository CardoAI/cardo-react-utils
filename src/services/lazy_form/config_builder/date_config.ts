import BaseConfig from "./base_config";
import { DATA_TYPES, INPUT_TYPES } from "../helpers";

class DateConfig extends BaseConfig {
  configMinDate: any;
  configMaxDate: any;

  constructor(label?: string) {
    super(INPUT_TYPES.DATE, label);
    this.configDataType = DATA_TYPES.STRING;
  }

  minDate(date: any) {
    this.configMinDate = date;
    return this;
  }

  maxDate(date: any) {
    this.configMaxDate = date;
    return this;
  }
}

export default DateConfig;
