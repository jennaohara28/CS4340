import { AuthService } from '../../components/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {

  // Defining fields
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Retrieve stored email and rememberMe status
    this.email = localStorage.getItem('email') || '';
    this.rememberMe = localStorage.getItem('rememberMe') === 'true';
  }

  // Method for logging in
  async login() {
    if (this.email && this.password) {
      this.authService.login(this.email, this.password, this.rememberMe).subscribe({
        next: (response) => {
          console.log('Login successful.', response);
          if (this.rememberMe) {
            localStorage.setItem('email', this.email);
            localStorage.setItem('rememberMe', 'true');
          } else {
            localStorage.removeItem('email');
            localStorage.removeItem('rememberMe');
          }
          this.router.navigate(['/']);
        },
        error: (error) => {
          // Display a generic message if login fails
          this.errorMessage = 'Invalid email or password. Please try again.';
          console.error('Login failed:', error);
        }
      });
    } else {
      this.errorMessage = 'Fill in both email and password.';
    }
  }

  // Accounting for if user forgot password
  showForgotPassword = false;
  resetEmail: string = '';
  resetMessage: string = '';

  // Show option when user fails at login attempt
  toggleForgotPassword() {
    this.showForgotPassword = !this.showForgotPassword;
  }

  // Allow user to request a password reset if desired
  requestPasswordReset() {
    this.authService.forgotPassword(this.resetEmail).subscribe({
      next: () => {
        this.resetMessage = 'A password reset link has been sent to your email.';
      },
      error: () => {
        this.resetMessage = 'Failed to send reset link. Please try again.';
      }
    });
  }
}
