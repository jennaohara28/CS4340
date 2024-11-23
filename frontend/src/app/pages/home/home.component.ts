import { Component } from '@angular/core';
import { AuthService } from '../../components/auth.service';
import { PieChartComponent } from "../../components/pie-chart/pie-chart.component";
import { WeekCalendarComponent } from "../../components/week-calendar/week-calendar.component";
import { TaskListComponent } from "../../components/task-list/task-list.component";

@Component({
    selector: 'app-home',
    imports: [
        PieChartComponent,
        WeekCalendarComponent,
        TaskListComponent
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
