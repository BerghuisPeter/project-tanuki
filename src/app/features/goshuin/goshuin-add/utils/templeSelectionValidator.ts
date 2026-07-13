import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const templeSelectionValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const selectedTemple = control.get('selectedTemple')?.value;

  // Existing temple selected
  if (selectedTemple) {
    return null;
  }

  const templeName = control.get('templeName')?.value;
  const city = control.get('city')?.value;
  const affiliationType = control.get('affiliationType')?.value;

  const isValid =
    !!templeName?.trim() &&
    !!city?.trim() &&
    !!affiliationType;

  return isValid ? null : { templeRequired: true };
};
