import { AbstractControl } from '@angular/forms';

export const matchPasswords = (control: AbstractControl) => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  password === confirmPassword ? null : { matchPasswords: true };
};
