import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { HomeService } from '../services/home.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent {
  public chart: any;
  chartuse: any;
  TimePrice: any;
  charts: any;
  constructor(private home: HomeService, private spinner: NgxSpinnerService, private configService: ConfigService ) { }
  ngOnInit(): void {
    this.getChartData('15', 'gold_24')
    const config = this.configService.getConfig();
    if (config && config.bookingPage  ) {
      this.charts = config.charts;
    }

  }
  createChart() {

    if (!this.TimePrice || !this.chartuse) {
      return;
    }

    // Check if a chart instance already exists
    if (this.chart) {
      // Destroy the existing chart instance
      this.chart.destroy();
    }

    // Create a new chart instance
    this.chart = new Chart("MyChart", {
      type: 'line',
      data: {
        labels: this.TimePrice,
        datasets: [
          {
            label: "Chart",
            data: this.chartuse,
            backgroundColor: '#18C07A',
            borderColor: '#18C07A',
            pointRadius: 0, // This will remove the dots
            borderWidth: 1, // Set the line width here

          },
        ]
      },
      options: {
        aspectRatio: 1.7
      }
    });
  }

  selectedTime: string | undefined;
  selectedType!: string;

  isTypeGold(event: any): void {
    const { name, value } = event.target;

    if (name === 'timeSelect') {
      this.selectedTime = value;
    } else if (name === 'typeSelect') {
      this.selectedType = value;
    }

    if (this.selectedTime && this.selectedType) {
      this.getChartData(this.selectedTime, this.selectedType);
    } else {
      console.log('Please select both values before proceeding.');
    }
  }

  getChartData(time: any, type: string) {
    const currentDate = new Date();
    const fifteenMinutesAgo = new Date(currentDate.getTime() - time * 60 * 1000);
    fifteenMinutesAgo.setSeconds(0);
    fifteenMinutesAgo.setMilliseconds(0);
    const formattedDate = fifteenMinutesAgo.toISOString().split('T')[0];
    const formattedTime = fifteenMinutesAgo.toTimeString().split(' ')[0].slice(0, -3);
    const currentTime = currentDate.toTimeString().split(' ')[0].slice(0, -3);

    this.spinner.show();
    const requestData = time == "9"
      ? { date: formattedDate, startTime: "09:30", endTime: currentTime, type: type }
      : { date: formattedDate, startTime: formattedTime, endTime: currentTime, type: type };

    this.home.chartData(requestData).subscribe((res: any) => {
      this.spinner.hide();
      this.chartuse = res.map((item: any) => item.buy_price_per_gram);
      this.TimePrice = res.map((item: any) => (new Date(item.created_at)).toTimeString().split(' ')[0].slice(0, -3)).reverse();
      this.createChart();
    });
  }

}
