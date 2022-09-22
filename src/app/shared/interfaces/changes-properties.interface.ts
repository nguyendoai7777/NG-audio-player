export interface ChangePropertyAccess<T extends any> {
  currentValue: T;
  firstChange: T;
  previousValue: T;
}
