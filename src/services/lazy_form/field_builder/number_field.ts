import BaseField from "./base_field";

class NumberField extends BaseField {
  min: number | undefined;
  max: number | undefined;

  constructor(name: string, fieldConfig: any) {
    super(name, fieldConfig);
    this.min = fieldConfig.configMin;
    this.max = fieldConfig.configMax;

    this.setValue = (newVal: any) => {
      const newValueAsNumber: number = Number(newVal);
      if (isNaN(newValueAsNumber)) return;
      if (this.min !== undefined && newValueAsNumber < this.value) return;
      if (this.max !== undefined && newValueAsNumber > this.value) return;
      this.value = newValueAsNumber;
    }
  }
}

export default NumberField;
