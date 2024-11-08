// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient, private router: Router) {}

  // Handle user login
  login(email: string, password: string, rememberMe: boolean): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        console.log('Response from login:', response);
        const userId = response.userId;
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

  static getUserId(): number | null {
    const userId = AuthService.getToken();
    return userId ? Number(userId) : null;
  }

  // Handle user registration
  register(name: string, email: string, password: string): Observable<any> {
    const body = { name, email, password };
    console.log('Sending registration request with body:', body);
    return this.http.post(`${this.baseUrl}/register`, body).pipe(
      tap((response) => {
        console.log('Registration successful, response:', response);
      }),
      catchError(error => {
        console.error('Registration failed with error details:', error);
        alert(`Registration error: ${error.message || 'Unknown error'}`);
        return throwError(error);
      })
    );
  }
}
