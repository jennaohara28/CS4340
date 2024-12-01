import { Component, OnInit, ElementRef, AfterViewInit, OnDestroy, HostListener, ViewEncapsulation } from '@angular/core';
import { TasksService } from '../../pages/tasks/tasks.service';
import { Task } from '../../pages/tasks/task.model';
import { AuthService } from '../auth.service';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [
    NgxChartsModule,
    MatTabsModule
  ],
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PieChartComponent implements OnInit, AfterViewInit, OnDestroy {
  public pieChartData: any[] = [];
  public view: [number, number] = [525, 300];
  public showLegend = true;
  public colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#f9dca4', '#FFC04C', '#FFA500', '#FF8C00']
  };
  public selectedTabIndex = 0;

  constructor(private tasksService: TasksService, private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.loadTaskStatuses();
  }

  ngAfterViewInit(): void {
    this.updateChartSize();
  }

  ngOnDestroy(): void {}

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateChartSize();
  }

  updateChartSize(): void {
    const element = this.elementRef.nativeElement.querySelector('.chart-container');
    if (element) {
      const width = element.innerWidth * 0.75; // Reduced by 25%
      this.view = [width, width * 0.57]; // Maintain aspect ratio
    }
  }

  loadTaskStatuses(): void {
    const userId = AuthService.getUserId() ?? '0';
    this.tasksService.getTasksByUserId(userId).subscribe({
      next: (tasks: Task[]) => {
        if (tasks.length === 0) {
          this.pieChartData = [];
          return;
        }
        const statusCounts: { [key: string]: number } = { 'To-Do': 0, 'In-Progress': 0, 'Done': 0, 'No Status': 0 };
        tasks.forEach(task => {
          if (!task.status) {
            statusCounts['No Status']++;
          } else if (task.status in statusCounts) {
            statusCounts[task.status as keyof typeof statusCounts]++;
          }
        });
        this.pieChartData = [
          { name: 'To-Do', value: statusCounts['To-Do'] },
          { name: 'In-Progress', value: statusCounts['In-Progress'] },
          { name: 'Done', value: statusCounts['Done'] },
          { name: 'No Status', value: statusCounts['No Status'] }
        ];
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
      }
    });
  }
}
