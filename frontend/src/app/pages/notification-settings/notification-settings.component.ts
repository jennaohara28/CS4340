import { Component, OnInit } from '@angular/core';
import { NotificationSettingsService } from './notification-settings.service';
import { Router } from '@angular/router';
import { AuthService } from '../../components/auth.service';

@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.css'],
  standalone: false,
})
export class NotificationSettingsComponent implements OnInit {
  notificationDays: number = 3;
  enableNotifications: boolean = true;
  notificationMethod: string = 'email';
  showSuccessMessage: boolean = false;
  loading: boolean = true;

  // Array of notification times
  notificationTimes: Array<{ time: string; period: string }> = [
    { time: '08:00', period: 'AM' },
  ];

  constructor(
    private notificationSettingsService: NotificationSettingsService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    const userEmail = this.authService.getUserEmail();
    if (!userEmail) {
      alert('No user logged in');
      return;
    }

    this.notificationSettingsService.getNotificationSettings(userEmail).subscribe({
      next: (settings) => {
        this.notificationDays = settings.daysBefore || 3;
        this.enableNotifications = settings.enabled || true;
        this.notificationMethod = settings.method || 'email';
        this.notificationTimes = settings.times || [{ time: '08:00', period: 'AM' }];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load settings:', err);
        alert('Failed to load settings! Please try again.');
        this.loading = false;
      },
    });
  }

  saveSettings() {
    const userEmail = this.authService.getUserEmail();
    if (!userEmail) {
      alert('No user logged in');
      return;
    }

    const settings = {
      userId: userEmail,
      daysBefore: this.notificationDays,
      enabled: this.enableNotifications,
      method: this.notificationMethod,
      times: this.notificationTimes.map((time) => ({
        time: time.time,
        period: time.period,
      })),
    };

    this.notificationSettingsService.updateNotificationSettings(settings).subscribe({
      next: (response) => {
        this.showSuccessMessage = true;
      },
      error: (err) => {
        console.error('Error saving settings:', err);
        alert(`Failed to save settings! Error: ${err.message || err.statusText}. Please check the payload structure.`);
      }
    });
  }

  addNotificationTime() {
    this.notificationTimes.push({ time: '08:00', period: 'AM' });
  }

  removeNotificationTime(index: number) {
    this.notificationTimes.splice(index, 1);
  }

  validateTimeInput(index: number): void {
    const parts = this.notificationTimes[index].time.split(':');
    if (parts.length === 2) {
      let hours = parts[0].replace(/\D/g, '');
      let minutes = parts[1].replace(/\D/g, '');

      // Allow hours between 00-23 for 24-hour time format
      if (parseInt(hours, 10) > 23) hours = '23';
      else if (parseInt(hours, 10) < 0 || hours === '') hours = '00';

      // Allow minutes between 00-59
      if (parseInt(minutes, 10) > 59) minutes = '59';
      else if (minutes === '' || parseInt(minutes, 10) < 0) minutes = '00';

      // Only update the time if the entered value is different from the corrected value
      const newTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
      if (this.notificationTimes[index].time !== newTime) {
        this.notificationTimes[index].time = newTime;
      }
    }
  }
}
