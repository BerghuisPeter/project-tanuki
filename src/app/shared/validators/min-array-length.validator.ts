import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minArrayLengthValidator(minLength: number, errorKey = 'arrayMinLength'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const length = Array.isArray(value) ? value.length : 0;

    if (length >= minLength) {
      return null;
    }

    return {
      [errorKey]: {
        requiredLength: minLength,
        actualLength: length
      }
    };
  };
}

