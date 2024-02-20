import { AbstractControl } from '@angular/forms';
import { map } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

export const existEmail = (authService: AuthService) => {
  return (control: AbstractControl) => {
    return authService
      .existEmail(control.value)
      .pipe(
        map((userExistance) => (userExistance ? { existEmail: true } : null))
      );
  };
};
