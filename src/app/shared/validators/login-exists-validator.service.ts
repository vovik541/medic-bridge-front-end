import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginExistsValidatorService {
  constructor(private http: HttpClient) {}

  checkLogin(login: string) {
    return this.http.get<boolean>(`${environment.apiUrl}/users/check-by-login`, { params: { login } });
  }

  checkEmail(email: string) {
    return this.http.get<boolean>(`${environment.apiUrl}/users/check-by-email`, { params: { email } });
  }
}
export function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const passwordRepeat = control.get('passwordRepeat')?.value;
  return password === passwordRepeat ? null : { passwordMismatch: true };
}