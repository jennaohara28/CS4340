import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CS3300';

  constructor(private router: Router) {}

  // Check if the current route is the login page, register page
  isOtherPage() {
    return this.router.url === '/login' || this.router.url === '/register';
  }
}
