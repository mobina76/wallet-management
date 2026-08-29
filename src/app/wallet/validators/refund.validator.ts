import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function positiveAmountValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value === null) {
    return null;
  }
  if (value <= 0) {
    return { positiveAmount: true };
  }
  return null;
}

export function lessThanBalanceValidator(balance: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null) {
      return null;
    }
    if (value >= balance) {
      return { lessThanBalance: true };
    }
    return null;
  };
}
