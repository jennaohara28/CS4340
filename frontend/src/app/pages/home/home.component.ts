import { Component } from '@angular/core';
import {PieChartComponent} from "../../components/pie-chart/pie-chart.component";
import {WeekCalendarComponent} from "../../components/week-calendar/week-calendar.component";
import {TaskListComponent} from "../../components/task-list/task-list.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    PieChartComponent,
    WeekCalendarComponent,
    TaskListComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
