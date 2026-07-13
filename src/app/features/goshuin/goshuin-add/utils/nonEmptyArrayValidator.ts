import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const nonEmptyArray: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value as unknown[];

  return Array.isArray(value) && value.length > 0
    ? null
    : { required: true };
};
