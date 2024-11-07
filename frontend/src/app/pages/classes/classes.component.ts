import { Component, OnInit } from '@angular/core';
import { Class } from './class.model';
import { ClassesService } from './classes.service';
import { TasksService } from '../tasks/tasks.service';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { Task } from '../tasks/task.model';
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../components/auth.service";

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    FormsModule
  ],
  styleUrls: ['./classes.component.css'],
  providers: [TasksService]
})
export class ClassesComponent implements OnInit {
  classes: Class[] = [];
  selectedClass: Class | null = null;
  tasks: Task[] = [];
  showAddClassForm: boolean = false;
  newClassName: string = '';
  editMode: boolean = false;

  constructor(private classesService: ClassesService, private tasksService: TasksService) {}

  ngOnInit(): void {
    this.classesService.getClasses().subscribe(
      (data: Class[]) => {
        this.classes = data;
      },
      (error) => {
        console.error('Error fetching classes:', error);
      }
    );
  }

  selectClass(classId: number): void {
    this.selectedClass = this.classes.find(c => c.id === classId) || null;
    this.editMode = false;
    if (this.selectedClass) {
      this.tasksService.getTasksByClassId(classId).subscribe(
        (data: Task[]) => {
          this.tasks = data;
        },
        (error) => {
          console.error('Error fetching tasks:', error);
        }
      );
    }
  }

  toggleAddClassForm(): void {
    this.showAddClassForm = !this.showAddClassForm;
  }

  addClass(): void {
    if (this.newClassName.trim()) {
      const userId = AuthService.getUserId() ?? 0;
      const newClass: Class = { id: 0, name: this.newClassName, ownerId: userId };
      this.classesService.addClass(newClass).subscribe(
        (data: Class) => {
          this.classes.push(data);
          this.newClassName = '';
          this.showAddClassForm = false;
        },
        (error) => {
          console.error('Error adding class:', error);
        }
      );
    }
  }

  enableEditMode(): void {
    this.editMode = true;
  }

  updateClass(): void {
    if (this.selectedClass) {
      this.classesService.updateClass(this.selectedClass).subscribe(
        (updatedClass: Class) => {
          const index = this.classes.findIndex(c => c.id === updatedClass.id);
          if (index !== -1) {
            this.classes[index] = updatedClass;
          }
          this.editMode = false;
        },
        (error) => {
          console.error('Error updating class:', error);
        }
      );
    }
  }

  deleteClass(classId: number): void {
    this.classesService.deleteClass(classId).subscribe(
      () => {
        this.classes = this.classes.filter(c => c.id !== classId);
        this.selectedClass = null;
      },
      (error) => {
        console.error('Error deleting class:', error);
      }
    );
  }
}
