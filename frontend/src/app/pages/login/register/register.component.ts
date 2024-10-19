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
  username: string = '';
  password: string = '';
  email: string = '';
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Method to handle registration form submission
  register(username: string, password: string, email: string) {
    if (username && password && email) {
      this.isLoading = true;
      this.authService.register(username, password, email).subscribe({
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
    } else {
      this.errorMessage = 'All fields are required.';
    }
  }
}
