import { AuthService } from '../../components/auth.service';
import { Router } from '@angular/router';
import {Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit} from '@angular/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('passwordResetForm', { static: false }) passwordResetForm!: ElementRef;

  // Defining fields
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  errorMessage: string = '';
  showForgotPassword = false;
  resetEmail: string = '';
  resetMessage: string = '';
  loading: boolean = false;
  isError: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Retrieve stored email and rememberMe status
    this.email = localStorage.getItem('email') || '';
    this.rememberMe = localStorage.getItem('rememberMe') === 'true';
  }

  // Draggable Elements
  ngAfterViewInit() {
    // Call setupDraggable only when `showForgotPassword` is true
    if (this.showForgotPassword) {
      this.setupDraggable();
    }
  }

  setupDraggable() {
    const draggableElement = this.passwordResetForm?.nativeElement;

    if (draggableElement) {
      let isDragging = false;
      let offsetX = 0;
      let offsetY = 0;

      draggableElement.style.position = 'fixed';

      // Mousedown
      draggableElement.addEventListener('mousedown', (e: MouseEvent) => {
        // Prevent dragging if the target is an input or button
        const target = e.target as HTMLElement;
        if (['INPUT', 'BUTTON'].includes(target.tagName) || target.classList.contains('close-button')) {
          return;
        }

        e.preventDefault();
        isDragging = true;

        // Calculate cursor offset relative to the draggable element
        const rect = draggableElement.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        draggableElement.style.cursor = 'grabbing';
      });

      // Mousemove
      document.addEventListener('mousemove', (e: MouseEvent) => {
        if (!isDragging) return;

        // Calculate the new position
        const newLeft = e.clientX - offsetX;
        const newTop = e.clientY - offsetY;

        // Apply new position to the element
        draggableElement.style.left = `${newLeft}px`;
        draggableElement.style.top = `${newTop}px`;
      });

      // Mouseup
      document.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          draggableElement.style.cursor = 'grab';
        }
      });
    }
  }

  toggleForgotPassword() {
    this.showForgotPassword = !this.showForgotPassword;
    if (this.showForgotPassword) {
      setTimeout(() => this.setupDraggable(), 0);
    }
    this.resetMessage = '';
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

  // Request Password Reset
  // Request Password Reset
  requestPasswordReset() {
    if (!this.resetEmail) {
      this.resetMessage = 'Please enter a valid email address.';
      this.isError = true;
      return;
    }

    this.loading = true;
    this.resetMessage = '';
    this.isError = false;

    this.authService.forgotPassword(this.resetEmail).subscribe({
      next: (response: string) => {

        // Assume success if we receive the expected text response
        if (response === 'Password reset link sent.') {
          this.loading = false;
          this.isError = false;
          this.resetMessage = response;
          this.resetEmail = '';
        } else {
          this.loading = false;
          this.isError = true;
          this.resetMessage = 'Failed to send reset link. Unexpected response.';
        }
      },
      error: (error) => {
        this.loading = false;
        this.isError = true;
        this.resetMessage = 'Failed to send reset link. Please try again.';
      },
    });
  }
}
