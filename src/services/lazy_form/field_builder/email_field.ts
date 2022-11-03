import BaseField from "./base_field";

class EmailField extends BaseField {
  maxLength: number | undefined;

  constructor(name: string, fieldConfig: any) {
    super(name, fieldConfig);
    this.maxLength = fieldConfig.configMaxLength;

    this.setValue = (newVal: any) => {
      if (typeof newVal !== 'string' && typeof newVal !== 'number') return;
      const newValueAsString = String(newVal);
      if (this.maxLength !== undefined && newValueAsString > this.value) return;
      this.value = newValueAsString;
    }
  }
}

export default EmailField;
