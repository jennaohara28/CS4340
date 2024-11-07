import { Component, OnInit } from '@angular/core';
import { TasksService } from './tasks.service';
import { AuthService } from '../../components/auth.service';
import { Task } from './task.model';
import {FormsModule} from "@angular/forms";
import {DatePipe, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    DatePipe
  ],
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  newTaskName: string = '';
  newTaskDueDate: string = '';
  newTaskType: string = '';
  newTaskTimeAll: number = 0;
  newTaskStatus: string = '';
  newTaskPriority: number = 0;
  newTaskClassId: number = 0;
  showAddTaskForm: boolean = false;
  selectedTask: Task | null = null;

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    const userId = AuthService.getUserId() ?? 0;
    this.tasksService.getTasksByUserId(userId).subscribe(
      (tasks: Task[]) => {
        this.tasks = tasks;
      },
      (error) => {
        console.error('Error loading tasks:', error);
      }
    );
  }

  toggleAddTaskForm(): void {
    this.showAddTaskForm = !this.showAddTaskForm;
  }

  addTask(): void {
    if (this.newTaskName.trim() && this.newTaskDueDate) {
      const newTask: Task = {
        id: 0,
        name: this.newTaskName,
        dueDate: '', // Convert Date to timestamp
        ownerId: AuthService.getUserId() ?? 0,
        type: this.newTaskType || '', // Default value if empty
        timeAll: this.newTaskTimeAll || 0, // Default value if empty
        status: this.newTaskStatus || '', // Default value if empty
        priority: this.newTaskPriority || 0, // Default value if empty
        classId: this.newTaskClassId || 0 // Default value if empty
      };
      this.tasksService.addTask(newTask).subscribe(
        (task: Task) => {
          this.tasks.push(task);
          this.newTaskName = '';
          this.newTaskDueDate = '';
          this.newTaskType = '';
          this.newTaskTimeAll = 0;
          this.newTaskStatus = '';
          this.newTaskPriority = 0;
          this.newTaskClassId = 0;
          this.showAddTaskForm = false;
        },
        (error) => {
          console.error('Error adding task:', error);
        }
      );
    }
  }

  selectTask(taskId: number): void {
    this.selectedTask = this.tasks.find(task => task.id === taskId) || null;
  }

  deleteTask(taskId: number): void {
    this.tasksService.deleteTask(taskId).subscribe(
      () => {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.selectedTask = null;
      },
      (error) => {
        console.error('Error deleting task:', error);
      }
    );
  }
}
