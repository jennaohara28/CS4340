import { Component } from '@angular/core';
import { Assignment } from './assignment.model';
import { DatePipe, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    NgForOf
  ],
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent {
  assignments: Assignment[] = [];
  newAssignment: Assignment = { id: 0, title: '', description: '', dueDate: '' as unknown as Date };

  addAssignment() {
    this.newAssignment.id = this.assignments.length + 1;
    this.assignments.push({ ...this.newAssignment });
    this.newAssignment = { id: 0, title: '', description: '', dueDate: '' as unknown as Date };
  }

  removeAssignment(id: number) {
    this.assignments = this.assignments.filter(assignment => assignment.id !== id);
  }
}
