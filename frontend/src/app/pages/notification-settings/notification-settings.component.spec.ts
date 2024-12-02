import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NotificationSettingsComponent } from './notification-settings.component';
import { NotificationSettingsService } from './notification-settings.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('NotificationSettingsComponent', () => {
  let component: NotificationSettingsComponent;
  let fixture: ComponentFixture<NotificationSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationSettingsComponent],
      providers: [
        NotificationSettingsService,
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should save settings', () => {
    const spy = spyOn(component['notificationSettingsService'], 'updateNotificationSettings').and.callThrough();
    component.saveSettings();
    expect(spy).toHaveBeenCalled();
  });
});
