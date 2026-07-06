import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart,
  ChartConfiguration,
  ChartData,
  ChartType,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { TeamLoad } from '../../core/models/analytics.model';

// Register all required Chart.js components (required with tree-shaking in v3+)
Chart.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-load-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="chart-container">
      <canvas baseChart
        [data]="chartData"
        [options]="chartOptions"
        type="bar">
      </canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      position: relative;
      width: 100%;
      height: 350px;
    }
  `]
})
export class LoadChartComponent implements OnChanges {
  @Input() teamLoad: TeamLoad | null = null;

  chartType: ChartType = 'bar';
  chartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#88888e' }
      },
      y: {
        stacked: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#88888e' }
      }
    },
    plugins: {
      legend: {
        labels: { color: '#e4e4e7' }
      }
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['teamLoad']) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    const gmailData = Array(24).fill(0);
    const slackData = Array(24).fill(0);
    const outlookData = Array(24).fill(0);
    const calendarData = Array(24).fill(0);

    if (this.teamLoad && this.teamLoad.data) {
      for (const bucket of this.teamLoad.data) {
        const hour = bucket.hourBucket;
        if (hour >= 0 && hour < 24) {
          if (bucket.source === 'GMAIL') gmailData[hour] += bucket.count;
          else if (bucket.source === 'SLACK') slackData[hour] += bucket.count;
          else if (bucket.source === 'OUTLOOK') outlookData[hour] += bucket.count;
          else if (bucket.source === 'CALENDAR') calendarData[hour] += bucket.count;
        }
      }
    }

    this.chartData = {
      labels: Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`),
      datasets: [
        { data: slackData, label: 'Slack', backgroundColor: '#4A154B', stack: 'a' },
        { data: gmailData, label: 'Gmail', backgroundColor: '#EA4335', stack: 'a' },
        { data: outlookData, label: 'Outlook', backgroundColor: '#0078D4', stack: 'a' },
        { data: calendarData, label: 'Calendar', backgroundColor: '#1A73E8', stack: 'a' }
      ]
    };
  }
}
