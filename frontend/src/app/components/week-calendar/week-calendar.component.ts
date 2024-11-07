import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../pages/tasks/tasks.service';
import { AuthService } from '../auth.service';
import { Task } from '../../pages/tasks/task.model';
import { DatePipe, NgForOf } from '@angular/common';

@Component({
  selector: 'app-week-calendar',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe
  ],
  templateUrl: './week-calendar.component.html',
  styleUrls: ['./week-calendar.component.css']
})
export class WeekCalendarComponent implements OnInit {
  public currentWeek: Date[] = [];
  public tasks: { [key: string]: Task[] } = {};
  public weekDays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    this.setCurrentWeek();
    this.loadTasksForCurrentWeek();
  }

  setCurrentWeek(): void {
    const startOfWeek = this.getStartOfWeek(new Date());
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      this.currentWeek.push(date);
    }
  }

  getStartOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  loadTasksForCurrentWeek(): void {
    this.tasksService.getTasksByUserId(AuthService.getUserId() ?? 0).subscribe((tasks: Task[]) => {
      this.currentWeek.forEach(date => {
        const dateString = date.toISOString().split('T')[0];
        this.tasks[dateString] = tasks.filter(task => task.dueDate === dateString);
      });
    });
  }
}
