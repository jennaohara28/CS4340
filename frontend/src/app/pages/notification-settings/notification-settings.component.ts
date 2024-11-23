import { Component } from '@angular/core';
import { NotificationSettingsService } from './notification-settings.service';

@Component({
    selector: 'app-notification-settings',
    templateUrl: './notification-settings.component.html',
    styleUrls: ['./notification-settings.component.css'],
    standalone: false
})
export class NotificationSettingsComponent {
  notificationDays: number = 3;
  enableNotifications: boolean = true;

  constructor(private notificationSettingsService: NotificationSettingsService) {}

  saveSettings() {
    const settings = {
      daysBefore: this.notificationDays,
      enabled: this.enableNotifications,
    };

    this.notificationSettingsService.updateNotificationSettings(settings).subscribe(() => {
      alert('Settings saved!');
    });
  }

  loadSettings(userId: number) {
    this.notificationSettingsService.getNotificationSettings(userId).subscribe((settings) => {
      this.notificationDays = settings.daysBefore;
      this.enableNotifications = settings.enabled;
    });
  }
}
