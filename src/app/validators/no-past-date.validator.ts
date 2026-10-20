
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const noPastDate: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value as string;

  if (!value) {
    return null;
  }

  // Build today's date in local time, formatted as YYYY-MM-DD.
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;

  return value < today ? { pastDate: true } : null;
};
