import { Component } from '@angular/core';
import { AuthService } from '../../components/auth.service';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.username, this.password).subscribe(response => {
      // Handle successful login
    }, error => {
      // Handle login error
    });
  }
}
