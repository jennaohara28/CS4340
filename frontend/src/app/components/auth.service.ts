// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  // Store credentials or tokens if login is successful and "Remember me" is checked
  login(username: string, password: string, rememberMe: boolean): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { username, password }).pipe(
      tap((response: any) => {
        if (rememberMe) {
          localStorage.setItem('username', username);
          localStorage.setItem('token', response.token);
        } else {
          sessionStorage.setItem('token', response.token);
        }
      })
    );
  }

  // Clear stored credentials
  logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    sessionStorage.removeItem('token');
  }

  // Check if the user is logged in by checking for token presence
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token') || !!sessionStorage.getItem('token');
  }

  // Retrieve token from either localStorage or sessionStorage
  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  // Handle user registration
  register(username: string, password: string, email: string): Observable<any> {
    const body = { username, password, email };
    return this.http.post(`${this.baseUrl}/register`, body);
  }
}
