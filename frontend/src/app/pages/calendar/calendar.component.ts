import { Component, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  standalone: true,
  imports: [NgForOf],
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  currentMonth: number = 0;
  currentYear: number = 0;
  daysInMonth: number[] = [];
  emptyDays: number[] = [];
  monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  weekDays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  ngOnInit() {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  generateCalendar(month: number, year: number) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    this.emptyDays = Array.from({ length: firstDay }, (_, i) => i);
    this.daysInMonth = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }

  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar(this.currentMonth, this.currentYear);
  }
}
