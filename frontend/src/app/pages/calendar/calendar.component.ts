import { Component, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';
import { TasksService } from '../../pages/tasks/tasks.service';
import { Task } from '../../pages/tasks/task.model';
import {AuthService} from "../../components/auth.service";

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
  tasks: { [key: string]: Task[] } = {};

  constructor(private tasksService: TasksService) {}

  ngOnInit() {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.generateCalendar(this.currentMonth, this.currentYear);
    this.loadTasksForCurrentMonth();
  }

  generateCalendar(month: number, year: number) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const lastDayOfPrevMonth = new Date(year, month, 0).getDate();

    this.emptyDays = Array.from({ length: firstDay }, (_, i) => lastDayOfPrevMonth - firstDay + i + 1);
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
    this.loadTasksForCurrentMonth();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar(this.currentMonth, this.currentYear);
    this.loadTasksForCurrentMonth();
  }

  loadTasksForCurrentMonth(): void {
    const userId = AuthService.getUserId() ?? 0;
    this.tasksService.getTasksByUserId(userId).subscribe((tasks: Task[]) => {
      this.tasks = {};
      tasks.forEach(task => {
        const taskDate = new Date(task.dueDate);
        if (taskDate.getMonth() === this.currentMonth && taskDate.getFullYear() === this.currentYear) {
          const dateString = taskDate.toISOString().split('T')[0];
          if (!this.tasks[dateString]) {
            this.tasks[dateString] = [];
          }
          this.tasks[dateString].push(task);
        }
      });
    });
  }

  getDateString(day: number): string {
    const month = this.currentMonth + 1;
    const dayString = day < 10 ? `0${day}` : `${day}`;
    const monthString = month < 10 ? `0${month}` : `${month}`;
    return `${this.currentYear}-${monthString}-${dayString}`;
  }
}
