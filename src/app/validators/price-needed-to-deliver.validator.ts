
import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

export const priceNeededToDeliver: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const status = control.get('status')?.value;
  const price = control.get('price')?.value;

  const priceIsEmpty =
    price === null ||
    price === undefined ||
    price === '';

  if (status === 'Delivered' && priceIsEmpty) {
    return { priceRequired: true };
  }

  return null;
};
