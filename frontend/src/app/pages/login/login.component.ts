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
    // Check if email and password fields have been filled
    if (this.email && this.password) {
      this.authService.login(this.email, this.password, this.rememberMe).subscribe({
        next: (response) => {
          // Handle successful login here and navigate to home page if successful
          console.log('Login successful.', response);

          // Store email in local storage if rememberMe is checked
          if (this.rememberMe) {
            localStorage.setItem('email', this.email);
            localStorage.setItem('rememberMe', 'true');
          } else {
            // Clear stored email if not remembering
            localStorage.removeItem('email');
            localStorage.removeItem('rememberMe');
          }

          this.router.navigate(['/']);
        },
        error: (error) => {
          // Log the full error response to identify the issue
          this.errorMessage = error.error || 'Invalid email or password. Please try again.';
          console.error('Login failed:', error);
        }
      });
    } else {
      this.errorMessage = 'Please fill in both email and password.';
    }
  }
}
