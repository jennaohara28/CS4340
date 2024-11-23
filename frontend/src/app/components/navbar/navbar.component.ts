import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NgIf } from '@angular/common';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIf, FaIconComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  title = 'CS3300';
  userEmail: string | null = null;
  faUserCircle = faUserCircle;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail();
  }

  isOtherPage() {
    return this.router.url === '/login' || this.router.url === '/register' || this.router.url === '/about';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      const email = this.authService.getUserEmail();
      if (email) {
        this.authService.deleteAccount(email).subscribe({
          next: () => {
            alert('Account deleted successfully.');
            this.authService.logout();
            this.router.navigate(['/register']);
          },
          error: (error) => {
            console.error('Error deleting account:', error);
            alert('Failed to delete account. Please try again.');
          }
        });
      } else {
        alert('No email found for the current user.');
      }
    }
  }
}
