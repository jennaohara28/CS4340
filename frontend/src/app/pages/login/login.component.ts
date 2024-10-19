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
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Method for logging in
  async login() {
    // Check is username and password fields have been filled
    if (this.username && this.password) {
      this.authService.login(this.username, this.password, this.rememberMe).subscribe({
        next: (response) => {
          // Handle successful login here and navigate to home page if successful
          console.log('Login successful.', response);
          this.router.navigate(['/']);
        },
        error: (error) => {
          // Handle error during login
          this.errorMessage = 'Login failed. Please try again.';
          console.error('Login failed.', error);
        }
      });
    } else {
      this.errorMessage = 'Please fill in both username and password.';
    }
  }
}
