export interface FlatValue {
  key: string | number,
  value: any,
  parents: (string | number)[]
}
