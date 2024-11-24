import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../components/auth.service';

@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.checkScroll();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    this.checkScroll();
  }

  checkScroll(): void {
    const sections = document.querySelectorAll('.section') as NodeListOf<HTMLElement>;
    const viewportHeight = window.innerHeight;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top >= 0 && rect.bottom <= viewportHeight) {
        section.classList.add('focused');
      } else {
        section.classList.remove('focused');
      }
    });
  }
}
