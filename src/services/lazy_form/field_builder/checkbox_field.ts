import BaseField from "./base_field";

class CheckboxField extends BaseField {
  options: any;
  isGroup: boolean;

  constructor(name: string, fieldConfig: any) {
    super(name, fieldConfig);
    this.options = fieldConfig.configOptions;
    this.isGroup = fieldConfig.configIsGroup;
  }
}

export default CheckboxField;
