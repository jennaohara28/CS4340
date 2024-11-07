import { Component, OnInit } from '@angular/core';
import { TasksService } from './tasks.service';
import { ClassesService } from '../classes/classes.service';
import { AuthService } from '../../components/auth.service';
import { Task } from './task.model';
import { Class } from '../classes/class.model';
import { FormsModule } from "@angular/forms";
import { DatePipe, NgForOf, NgIf } from "@angular/common";

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
  classes: Class[] = [];
  newTaskName: string = '';
  newTaskDueDate: string = '';
  newTaskType: string = '';
  newTaskTimeAll: number = 0;
  newTaskStatus: string = '';
  newTaskPriority: number = 0;
  newTaskClassId: number = 0;
  showAddTaskForm: boolean = false;
  selectedTask: Task | null = null;
  editMode: boolean = false;

  constructor(private tasksService: TasksService, private classesService: ClassesService) {}

  ngOnInit(): void {
    this.loadTasks();
    this.loadClasses();
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

  loadClasses(): void {
    const userId = AuthService.getUserId() ?? 0;
    this.classesService.getClasses().subscribe(
      (classes: Class[]) => {
        this.classes = classes;
      },
      (error) => {
        console.error('Error loading classes:', error);
      }
    );
  }

  toggleAddTaskForm(): void {
    this.showAddTaskForm = !this.showAddTaskForm;
  }

  addTask(): void {
    if (this.newTaskName.trim() && this.newTaskDueDate && this.newTaskClassId) {
      const newTask: Task = {
        id: 0,
        name: this.newTaskName,
        dueDate: this.newTaskDueDate,
        ownerId: AuthService.getUserId() ?? 0,
        type: this.newTaskType || '',
        timeAll: this.newTaskTimeAll || 0,
        status: this.newTaskStatus || '',
        priority: this.newTaskPriority || 0,
        classId: this.newTaskClassId
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
    this.editMode = false;
  }

  enableEditMode(): void {
    this.editMode = true;
  }

  updateTask(): void {
    if (this.selectedTask) {
      this.tasksService.updateTask(this.selectedTask).subscribe(
        (updatedTask: Task) => {
          const index = this.tasks.findIndex(task => task.id === updatedTask.id);
          if (index !== -1) {
            this.tasks[index] = updatedTask;
          }
          this.editMode = false;
        },
        (error) => {
          console.error('Error updating task:', error);
        }
      );
    }
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
