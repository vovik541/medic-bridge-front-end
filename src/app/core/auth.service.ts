import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../environments/environment'
import { tap } from 'rxjs';

export interface AuthenticationRequest {
  email: string;
  password: string;
}

export interface AuthenticationResponse {
  access_token: string;
  refresh_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  login(request: AuthenticationRequest): Observable<AuthenticationResponse> {
  return this.http.post<AuthenticationResponse>(environment.apiUrl + '/auth/authenticate', request).pipe(
    tap((res: AuthenticationResponse) => {
      if (res.access_token && res.refresh_token) {
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('refresh_token', res.refresh_token);
      }
    })
  );
}

  logout() {
  this.http.post(environment.apiUrl + '/auth/logout', {}, {}).subscribe({
    next: () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      this.router.navigate(['/login']);
    },
    error: () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      this.router.navigate(['/login']);
    }
  });
}
}