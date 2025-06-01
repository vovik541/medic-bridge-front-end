import { AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { debounceTime, switchMap, map, catchError, of } from 'rxjs';
import { LoginExistsValidatorService } from './login-exists-validator.service';

export function loginExistsValidator(service: LoginExistsValidatorService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return of(control.value).pipe(
      debounceTime(400),
      switchMap(value => service.checkLogin(value)),
      map(() => ({ loginTaken: true })),
      catchError(() => of(null))
    );
  };
}

export function emailExistsValidator(service: LoginExistsValidatorService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return of(control.value).pipe(
      debounceTime(400),
      switchMap(value => service.checkEmail(value)),
      map(() => ({ emailTaken: true })),
      catchError(() => of(null))
    );
  };
}
