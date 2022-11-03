import BaseField from "./base_field";

class MultiselectField extends BaseField {
  options: any;
  optionsUrl: string | undefined;

  constructor(name: string, fieldConfig: any) {
    super(name, fieldConfig);
    this.options = fieldConfig.configOptions;
    this.optionsUrl = fieldConfig.configOptionsUrl;
  }
}

export default MultiselectField;
