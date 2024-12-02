import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../components/auth.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ResetPasswordComponent } from './reset-password.component';
import {FormsModule} from "@angular/forms";

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: ActivatedRoute;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['resetPassword']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      queryParams: of({ token: 'test-token' }),
    } as unknown as ActivatedRoute;

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ResetPasswordComponent],
      providers: [
        provideHttpClientTesting(),
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the token from queryParams on init', () => {
    expect(component.token).toEqual('test-token');
  });

  it('should call AuthService.resetPassword on resetPassword', () => {
    mockAuthService.resetPassword.and.returnValue(of({}));
    component.newPassword = 'password123';
    component.confirmPassword = 'password123';

    component.resetPassword();

    expect(mockAuthService.resetPassword).toHaveBeenCalledWith('test-token', 'password123');
  });

  it('should navigate to login after successful password reset', () => {
    mockAuthService.resetPassword.and.returnValue(of({}));
    component.newPassword = 'password123';
    component.confirmPassword = 'password123';

    component.resetPassword();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
