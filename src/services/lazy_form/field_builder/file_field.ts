import BaseField from "./base_field";
import { isFile } from "../helpers";

class FileField extends BaseField {
  maxSize: number | undefined;

  constructor(name: string, fieldConfig: any) {
    super(name, fieldConfig);
    this.maxSize = fieldConfig.configMaxSize;

    this.setValue = (newFile: any) => {
      if (!isFile(newFile)) return;
      if (this.maxSize !== undefined && newFile.size > this.maxSize) return;
      this.value = newFile;
    }
  }
}

export default FileField;
