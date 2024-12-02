import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../pages/tasks/tasks.service';
import { AuthService } from '../auth.service';
import { Task } from '../../pages/tasks/task.model';
import { DatePipe, NgForOf } from '@angular/common';
import {Router} from "@angular/router";
import {Class} from "../../pages/classes/class.model";
import {ClassesService} from "../../pages/classes/classes.service";

@Component({
  selector: 'app-week-calendar',
  imports: [
    NgForOf,
    DatePipe
  ],
  templateUrl: './week-calendar.component.html',
  standalone: true,
  styleUrls: ['./week-calendar.component.css']
})
export class WeekCalendarComponent implements OnInit {
  public currentWeek: Date[] = [];
  public tasks: { [key: string]: Task[] } = {};
  public weekDays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  public weekDaysShortened: string[] = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  public classes: Class[] = [];

  constructor(private tasksService: TasksService, private classesService: ClassesService, private router: Router) {}

  ngOnInit(): void {
    this.setCurrentWeek();
    this.loadClasses();
    this.loadTasksForCurrentWeek();
  }

  openTaskPage(taskId: number) {
    this.router.navigate(['/assignments'], {queryParams: {selectedTask: taskId}});
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
    this.tasksService.getTasksByUserId(AuthService.getUserId() ?? '0').subscribe((tasks: Task[]) => {
      this.currentWeek.forEach(date => {
        const dateString = date.toISOString().split('T')[0];
        this.tasks[dateString] = tasks.filter(task => task.dueDate === dateString);
      });
    });
  }

  loadClasses(): void {
    this.classesService.getClasses().subscribe((classes: Class[]) => {
      this.classes = classes;
    });
  }

  getClassColor(classId: number): string {
    const taskClass = this.classes.find(cls => cls.id === classId);
    return taskClass ? taskClass.color : '#ffffff'; // default to white if no class found
  }
}
