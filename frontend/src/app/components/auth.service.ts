import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${window.__env.apiBaseUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  // Handle user login
  login(email: string, password: string, rememberMe: boolean): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        const userId = response.userId;
        console.log('Retrieved userId:', userId);
        if (rememberMe) {
          localStorage.setItem('userId', userId);
        } else {
          sessionStorage.setItem('userId', userId);
        }
      }),
      catchError(error => {
        console.error('Login failed:', error);
        return throwError(error);
      })
    );
  }

  // Clear stored credentials and redirect to login page
  logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('userId');
    sessionStorage.removeItem('userId');
  }

  // Check if the user is logged in by checking for token presence
  isLoggedIn(): boolean {
    return !!localStorage.getItem('userId') || !!sessionStorage.getItem('userId');
  }

  // Retrieve token from either localStorage or sessionStorage
  getToken(): string | null {
    return localStorage.getItem('userId') || sessionStorage.getItem('userId');
  }

  static getToken(): string | null {
    return localStorage.getItem('userId') || sessionStorage.getItem('userId');
  }

  static setUserId(userId: string): void {
    localStorage.setItem('userId', userId);
  }

  static getUserId(): string | null {
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    console.log('AuthService.getUserId:', userId);
    return userId;
  }

  getUserEmail(): string | null {
    const email = localStorage.getItem('email') || sessionStorage.getItem('email');
    console.log('Retrieved email:', email);
    return email;
  }

  // Handle user registration
  register(name: string, email: string, password: string): Observable<any> {
    const body = { name, email, password };
    return this.http.post(`${this.baseUrl}/register`, body).pipe(
      tap((response: any) => {
        console.log('Registration successful:', response);
        const userId = response.userId;
        if (userId) {
          localStorage.setItem('userId', userId);
        }
      }),
      catchError(error => {
        console.error('Registration failed:', error);
        return throwError(error);
      })
    );
  }

  // Handle if user forgot password
  forgotPassword(email: string): Observable<any> {
    // Ensure Angular processes the response as text
    return this.http.post(`${this.baseUrl}/forgot-password`, { email }, { responseType: 'text' }).pipe(
      catchError(error => {
        console.error('Forgot Password Error:', error);
        return throwError(error);
      })
    );
  }

  // Handle Password Reset
  // AuthService: Handle Password Reset with text response
  resetPassword(token: string, newPassword: string): Observable<any> {
    const url = `${this.baseUrl}/reset-password`;
    const body = { token, newPassword };
    return this.http.post(url, body, { responseType: 'text' }).pipe(
      tap(response => {
        console.log('Reset Password Response:', response);
      }),
      catchError(error => {
        console.error('Reset Password Error:', error);
        return throwError(error);
      })
    );
  }

  // Delete account
  deleteAccount(userId: string): Observable<any> {
    return this.http.delete(`${window.__env.apiBaseUrl}/api/users/delete-account/${userId}`, { responseType: 'json' }).pipe(
      catchError(error => {
        console.error('Account deletion failed:', error);
        return throwError(() => error);
      })
    );
  }
}
