import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showNavbar: boolean = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Hide navbar for the following routes
        const hiddenRoutes = ['/login', '/about', '/register', '/reset-password'];
        this.showNavbar = !hiddenRoutes.some((route) => event.url.includes(route));
      }
    });
  }
}
