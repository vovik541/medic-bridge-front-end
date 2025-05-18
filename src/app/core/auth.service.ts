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
  roles: string[];
}

export interface RegisterRequest {
  firstname: string;
  lastname: string;
  login: string;
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
        if (res.access_token && res.refresh_token && res.roles) {
          localStorage.setItem('access_token', res.access_token);
          localStorage.setItem('refresh_token', res.refresh_token);
          localStorage.setItem('roles', JSON.stringify(res.roles));
        }
      })
    );
  }

  register(req: RegisterRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${environment.apiUrl}/auth/register`, req).pipe(
      tap((res: AuthenticationResponse) => {
        if (res.access_token && res.refresh_token && res.roles) {
          localStorage.setItem('access_token', res.access_token);
          localStorage.setItem('refresh_token', res.refresh_token);
          localStorage.setItem('roles', JSON.stringify(res.roles));
        }
      })
    );
  }

  logout() {
    this.http.post(environment.apiUrl + '/auth/logout', {}, {}).subscribe({
      next: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('roles');
        this.router.navigate(['/']);
      },
      error: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('roles');
        this.router.navigate(['/']);
      }
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }
}