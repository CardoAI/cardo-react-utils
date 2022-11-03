import { ERROR_MESSAGES, isEmpty, toTitleCase } from "../helpers";

class BaseField {
  name: string;
  label: string;
  value: any | undefined;
  error: string | undefined;
  required: boolean;
  validating: boolean;
  dataType: string;
  inputType: string;
  extra: any;
  requiredMessage: string | undefined = undefined;
  inputValidations: ((value: any) => (string | undefined))[] = [];
  customValidations: any[] = [];

  setValue: (newValue: any) => void;
  validate: (allValues: any, updateState: () => void) => Promise<void>;

  constructor(name: string, fieldConfig: any) {
    this.name = name;
    this.label = fieldConfig.configLabel ?? toTitleCase(name);
    this.value = fieldConfig.configValue;
    this.error = undefined;
    this.required = fieldConfig.configRequired;
    this.validating = false;
    this.dataType = fieldConfig.configDataType;
    this.inputType = fieldConfig.configInputType;
    this.extra = fieldConfig.configExtra;
    this.requiredMessage = fieldConfig.configRequiredMessage;
    this.inputValidations = fieldConfig.configInputValidations;
    this.customValidations = fieldConfig.configCustomValidations;

    this.setValue = (newValue: any) => {
      this.value = newValue;
    }

    this.validate = async (allValues: any, updateState: () => void) => {

      // REQUIRED VALIDATION
      if (this.required && isEmpty(this.value)) {
        this.error = this.requiredMessage ?? `${this.label} ${ERROR_MESSAGES.REQUIRED}`;
        return;
      }

      // INPUT VALIDATIONS
      for (const inputValidation of this.inputValidations) {
        this.error = inputValidation(this.value);
        if (this.error !== undefined) return;
      }

      // CUSTOM VALIDATIONS
      const values = typeof allValues === 'function' ? allValues() : allValues;
      for (const customValidation of this.customValidations) {
        if (customValidation[Symbol.toStringTag] === 'AsyncFunction') {
          // ASYNC VALIDATIONS
          try {
            this.validating = true;
            updateState();
            this.error = await customValidation(this.value, values);
            if (this.error !== undefined) {
              this.validating = false;
              return;
            }
          } catch (error: any) {
            console.error(`async validation error for field ${this.name}`, error);
            this.validating = false;
          }
        } else {
          // OTHER VALIDATIONS
          this.error = customValidation(this.value, values);
          if (this.error !== undefined) return;
        }
      }
    }
  }
}

export default BaseField;
