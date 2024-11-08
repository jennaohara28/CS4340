// auth-redirect.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthRedirectGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      // Redirect logged-in users to the home page
      this.router.navigate(['/home']);
      return false;
    } else {
      // Redirect logged-out users to the login page
      this.router.navigate(['/login']);
      return false;
    }
  }
}
