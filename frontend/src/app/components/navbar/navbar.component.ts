import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgIf,
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  title = 'CS3300';

  constructor(private authService: AuthService, private router: Router) {}

  // Check if the current route is the login page, register page
  isOtherPage() {
    return this.router.url === '/login' || this.router.url === '/register' || this.router.url === '/about';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
