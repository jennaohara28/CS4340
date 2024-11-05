import { AuthService } from '../../components/auth.service';
import {Router} from "@angular/router";
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {

  // Defining fields
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Method for logging in
  async login() {
    // Check if email and password fields have been filled
    if (this.email && this.password) {
      this.authService.login(this.email, this.password, this.rememberMe).subscribe({
        next: (response) => {
          // Handle successful login here and navigate to home page if successful
          console.log('Login successful.', response);
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
