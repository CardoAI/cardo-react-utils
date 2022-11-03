import BaseField from "./base_field";

class StringField extends BaseField {
  maxLength: number | undefined;

  constructor(name: string, fieldConfig: any) {
    super(name, fieldConfig);
    this.maxLength = fieldConfig.configMaxLength;

    this.setValue = (newVal: any) => {
      if (typeof newVal !== 'string' && typeof newVal !== 'number') return;
      const newValueAsString: string = String(newVal);
      if (this.maxLength !== undefined && newValueAsString.length > this.maxLength) return;
      this.value = newValueAsString;
    }
  }
}

export default StringField;
