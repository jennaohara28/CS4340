import { Component } from '@angular/core';
import { AuthService } from '../../../components/auth.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  // Defining fields
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Method to handle registration form submission
  register(name: string, email: string, password: string, confirmPassword: string) {
    if (!name || !email || !password || !confirmPassword) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    if (password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;
    this.authService.register(name, email, password).subscribe({
      next: (response) => {
        this.successMessage = 'Registration successful! Redirecting to login...';
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.errorMessage = 'Registration failed. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
