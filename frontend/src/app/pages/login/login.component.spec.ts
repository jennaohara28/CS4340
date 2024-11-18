import { AuthService } from '../../components/auth.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

class MockAuthService {
  login(email: string, password: string, rememberMe: boolean) {
    if (email === 'validUser' && password === 'validPassword') {
      return of({ success: true });
    }
    return throwError({ error: 'Invalid credentials' });
  }
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: MockAuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    expect(component.email).toEqual('');
    expect(component.password).toEqual('');
    expect(component.rememberMe).toBeFalse();
  });

  it('should display an error message if credentials are invalid', () => {
    component.email = 'invalidUser';
    component.password = 'wrongPassword';
    component.login();
    fixture.detectChanges();

    expect(component.errorMessage).toEqual('Invalid email or password. Please try again.');
  });

  it('should navigate to home page after successful login', () => {
    component.email = 'validUser';
    component.password = 'validPassword';
    component.login();
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
