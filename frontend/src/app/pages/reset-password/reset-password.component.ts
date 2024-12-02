import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../components/auth.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css'],
    standalone: false
})
export class ResetPasswordComponent {
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  resetMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Extract token from the URL
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
    });

    // Hide navigation bar (use a shared service or directly manipulate DOM)
    const navBar = document.querySelector('.navbar');
    if (navBar) {
      navBar.setAttribute('style', 'display: none');
    }
  }

  ngOnDestroy() {
    const navBar = document.querySelector('.navbar');
    if (navBar) {
      navBar.removeAttribute('style');
    }
  }

  resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.resetMessage = 'Passwords do not match.';
      return;
    }

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: (response) => {

        if (response === 'Password reset successful.') {
          this.resetMessage = 'Password reset successful. Redirecting...';
          setTimeout(() => this.router.navigate(['/login']), 3000);
        } else {
          this.resetMessage = 'Failed to reset password. Unexpected response.';
        }
      },
      error: (error) => {
        console.error('Error during password reset:', error);
        this.resetMessage = 'Failed to reset password. Please try again.';
      }
    });
  }

  isErrorMessage(message: string): boolean {
    return message.includes('Failed') || message.includes('not match');
  }
}
