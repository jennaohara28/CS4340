import { TestBed } from '@angular/core/testing';
import { NotificationSettingsService } from './notification-settings.service';
import { HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('NotificationSettingsService', () => {
  let service: NotificationSettingsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationSettingsService,
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(NotificationSettingsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch notification settings', () => {
    const mockSettings = { daysBefore: 3, enabled: true };

    service.getNotificationSettings(1).subscribe((settings) => {
      expect(settings).toEqual(mockSettings);
    });

    const req = httpMock.expectOne('/api/notification-settings/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockSettings);
  });

  it('should update notification settings', () => {
    const settingsToUpdate = { daysBefore: 5, enabled: false };

    service.updateNotificationSettings(settingsToUpdate).subscribe((response) => {
      expect(response).toEqual(settingsToUpdate);
    });

    const req = httpMock.expectOne('/api/notification-settings');
    expect(req.request.method).toBe('PUT');
    req.flush(settingsToUpdate);
  });
});
