import BaseField from "./base_field";

class RadioField extends BaseField {
  options: any;
  isMultiselect: boolean;

  constructor(name: string, fieldConfig: any) {
    super(name, fieldConfig);
    this.options = fieldConfig.configOptions;
    this.isMultiselect = fieldConfig.configIsMultiselect;
  }
}

export default RadioField;
