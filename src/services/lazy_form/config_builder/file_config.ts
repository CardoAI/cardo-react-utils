import BaseConfig from "./base_config";
import { DATA_TYPES, INPUT_TYPES } from "../helpers";

class FileConfig extends BaseConfig {
  configMaxSize: number | undefined;

  constructor(label?: string) {
    super(INPUT_TYPES.FILE, label);
    this.configDataType = DATA_TYPES.OBJECT;
  }

  maxSize(value: number) {
    if (typeof value === 'number')
      this.configMaxSize = value;

    return this;
  }
}

export default FileConfig;
