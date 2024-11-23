import { Component, OnInit } from '@angular/core';
import { TasksService } from './tasks.service';
import { ClassesService } from '../classes/classes.service';
import { AuthService } from '../../components/auth.service';
import { Task } from './task.model';
import { Class } from '../classes/class.model';
import { FormsModule } from "@angular/forms";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";

@Component({
    selector: 'app-tasks',
    standalone: true,
    imports: [
        FormsModule,
        NgForOf,
        NgIf,
        DatePipe,
        NgClass
    ],
    templateUrl: './tasks.component.html',
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

  isModalOpen: boolean = false;
  modalMode: 'add' | 'edit' = 'add';

  constructor(private tasksService: TasksService, private classesService: ClassesService) {}

  ngOnInit(): void {
    this.loadTasks();
    this.loadClasses();
  }

  loadTasks(): void {
    const userId = AuthService.getUserId() ?? 0;
    this.tasksService.getTasksByUserId(userId).subscribe({
      next: (tasks: Task[]) => {
        this.tasks = tasks;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
      }
    });
  }

  loadClasses(): void {
    const userId = AuthService.getUserId() ?? 0;
    this.classesService.getClasses().subscribe({
      next: (classes: Class[]) => {
        this.classes = classes;
      },
      error: (error) => {
        console.error('Error loading classes:', error);
      }
    });
  }

  toggleAddTaskForm(): void {
    this.showAddTaskForm = !this.showAddTaskForm;
  }

  resetNewTaskForm(): void {
    this.newTaskName = '';
    this.newTaskDueDate = '';
    this.newTaskType = '';
    this.newTaskTimeAll = 0;
    this.newTaskStatus = '';
    this.newTaskPriority = 0;
    this.newTaskClassId = 0;
    this.showAddTaskForm = false;
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
      this.tasksService.addTask(newTask).subscribe({
        next: (task: Task) => {
          this.tasks.push(task);
          this.resetNewTaskForm();
        },
        error: (error) => {
          console.error('Error adding task:', error);
        }
      });
    }
  }

  selectTask(taskId: number): void {
    if (this.selectedTask && this.selectedTask.id === taskId) {
      this.selectedTask = null; // Unselect if the same task is clicked
    } else {
      this.selectedTask = this.tasks.find(task => task.id === taskId) || null;
    }
  }

  enableEditMode(): void {
    this.editMode = true;
  }

  updateTask(): void {
    if (this.selectedTask) {
      this.tasksService.updateTask(this.selectedTask).subscribe({
        next: (updatedTask: Task) => {
          const index = this.tasks.findIndex(task => task.id === updatedTask.id);
          if (index !== -1) {
            this.tasks[index] = updatedTask;
          }
          this.editMode = false;
          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating task:', error);
        }
      });
    }
  }

  deleteTask(taskId: number): void {
    this.tasksService.deleteTask(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.selectedTask = null;
      },
      error: (error) => {
        console.error('Error deleting task:', error);
      }
    });
  }

  getClassById(classId: number): Class | undefined {
    return this.classes.find(cls => cls.id === classId);
  }

  openModal(mode: 'add' | 'edit'): void {
    this.modalMode = mode;
    if (mode === 'edit' && this.selectedTask) {
      this.newTaskName = this.selectedTask.name;
      this.newTaskDueDate = this.selectedTask.dueDate;
      this.newTaskType = this.selectedTask.type;
      this.newTaskTimeAll = this.selectedTask.timeAll;
      this.newTaskStatus = this.selectedTask.status;
      this.newTaskPriority = this.selectedTask.priority;
      this.newTaskClassId = this.selectedTask.classId;
    } else {
      this.newTaskName = '';
      this.newTaskDueDate = '';
      this.newTaskType = '';
      this.newTaskTimeAll = 0;
      this.newTaskStatus = '';
      this.newTaskPriority = 0;
      this.newTaskClassId = 0;
    }
    this.isModalOpen = true;
  }


  closeModal(): void {
    this.isModalOpen = false;
  }
}
