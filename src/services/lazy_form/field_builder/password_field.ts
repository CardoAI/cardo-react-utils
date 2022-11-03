import BaseField from "./base_field";

class PasswordField extends BaseField {
  minLength: number | undefined;
  maxLength: number | undefined;

  constructor(name: string, fieldConfig: any) {
    super(name, fieldConfig);
    this.minLength = fieldConfig.configMinLength;
    this.maxLength = fieldConfig.configMaxLength;

    this.setValue = (newVal: any) => {
      if (typeof newVal !== 'string' && typeof newVal !== 'number') return;
      const newValueAsString = String(newVal);
      if (this.minLength !== undefined && newValueAsString < this.value) return;
      if (this.maxLength !== undefined && newValueAsString > this.value) return;
      this.value = newValueAsString;
    }
  }
}

export default PasswordField;
