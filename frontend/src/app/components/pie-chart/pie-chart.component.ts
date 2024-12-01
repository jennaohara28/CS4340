import { Component, OnInit, ElementRef, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { TasksService } from '../../pages/tasks/tasks.service';
import { Task } from '../../pages/tasks/task.model';
import { AuthService } from '../auth.service';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
    selector: 'app-pie-chart',
    standalone: true,
    imports: [
        NgxChartsModule
    ],
    templateUrl: './pie-chart.component.html',
    styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit, AfterViewInit, OnDestroy {
  public pieChartData: any[] = [];
  public view: [number, number] = [525, 300];
  public showLegend = true;
  public colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#c7b42c', '#a10a28']
  };

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
    const element = this.elementRef.nativeElement.querySelector('.pie-chart-container');
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
        const statusCounts: { [key: string]: number } = { 'To-Do': 0, 'In-Progress': 0, 'Done': 0 };
        tasks.forEach(task => {
          if (task.status in statusCounts) {
            statusCounts[task.status as keyof typeof statusCounts]++;
          }
        });
        this.pieChartData = [
          { name: 'To-Do', value: statusCounts['To-Do'] },
          { name: 'In-Progress', value: statusCounts['In-Progress'] },
          { name: 'Done', value: statusCounts['Done'] }
        ];
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
      }
    });
  }

}
