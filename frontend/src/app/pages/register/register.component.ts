import { Component, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../components/auth.service';
import { Router } from "@angular/router";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    standalone: false
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

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  // Method to handle registration form submission
  register(name: string, email: string, password: string, confirmPassword: string) {
    // Clear previous messages
    this.errorMessage = '';
    this.successMessage = '';

    // Check for empty fields
    if (!name || !email || !password || !confirmPassword) {
      this.errorMessage = 'All fields are required.';
      this.cdr.detectChanges();
      console.log('Registration failed: All fields are required.');
      return;
    }

    // Check for password match
    if (password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      this.cdr.detectChanges();
      console.log('Registration failed: Passwords do not match.');
      return;
    }

    // Start loading and initiate registration
    this.isLoading = true;
    this.authService.register(name, email, password).subscribe({
      next: () => {
        // Show success message upon successful registration
        this.successMessage = 'Success! Logging in...';
        this.isLoading = false;
        this.cdr.detectChanges();

        // Proceed to auto-login without clearing the success message
        this.autoLogin(email, password);
      },
      error: (error) => {
        // Show error message if registration fails
        this.errorMessage = `Registration failed: ${error.message || 'Please try again.'}`;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Method to log the user in automatically after registration
  autoLogin(email: string, password: string) {
    this.authService.login(email, password, false).subscribe({
      next: (response) => {
        console.log('Auto-login successful after registration:', response);
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Auto-login failed:', error);
        this.errorMessage = 'Auto-login failed. Please log in manually.';
        this.cdr.detectChanges();
      }
    });
  }
}
