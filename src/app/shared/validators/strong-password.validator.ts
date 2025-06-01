import { AbstractControl, ValidationErrors } from '@angular/forms';

export function strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!value) return null;

  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasMinLength = value.length >= 8;

  const isValid = hasUpperCase && hasLowerCase && hasNumber && hasMinLength;

  return isValid ? null : { weakPassword: true };
}
