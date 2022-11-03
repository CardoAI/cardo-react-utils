import BaseField from "./base_field";

class DateField extends BaseField {
  minDate: any;
  maxDate: any;

  constructor(name: string, fieldConfig: any) {
    super(name, fieldConfig);
    this.minDate = fieldConfig.configMinDate;
    this.maxDate = fieldConfig.configMaxDate;
  }
}

export default DateField;
