import { Component } from '@angular/core';
import { GoldSilverService } from '../services/gold-silver.service';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-predictions',
  templateUrl: './predictions.component.html',
  styleUrls: ['./predictions.component.scss']
})
export class PredictionsComponent {

  predictedPrices22: any[] = [];
  predictedPrices24: any[] = [];
  predictedPricesSilver: any[] = [];
  lineChartData22: any[] = [];
  lineChartData24: any[] = [];
  lineChartDataSilver: any[] = [];
  view: [number, number] = [800, 1000]; // Width and height of the chart

  // Options
  showXAxis = true;
  showYAxis = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Date';
  showYAxisLabel = true;
  yAxisLabel22 = '22k Gold Per Gram Predicted Price';
  yAxisLabel24 = '24k Gold Per Gram Predicted Price';
  yAxisLabelSilver = 'Silver Per kG Predicted Price';
  colorScheme22 = { domain: ['#5AA454'] };
  colorScheme24 = { domain: ['#C7B42C'] };
  colorSchemeSilver = { domain: ['#AAAAAA'] };
  showDataLabel = true;



  constructor(private dataService: GoldSilverService) { }

  ngOnInit(): void {
    // this.getPredictedPrices22();
    this.getPredictedPrices24();
    this.getPredictedPricesSilver();
  }

  // getPredictedPrices22(): void {
  //   this.dataService.getPredictedPrices22Carats('2024-06-01', '2024-06-10')
  //     .subscribe(
  //       (response: any) => {
  //         this.predictedPrices22 = this.sanitizeData(response);
  //         console.log('Predicted Prices 22carats:', this.predictedPrices22);

  //         this.lineChartData22 = [
  //           {
  //             name: '22k Gold Per Gram Predicted Price',
  //             series: this.predictedPrices22.map(item => ({
  //               name: item.start_date,
  //               value: item.Predicted_Buy_Price
  //             }))
  //           }
  //         ];
  //       },
  //       (error: any) => {
  //         console.error('Error fetching predicted prices for 22 carats:', error);
  //       }
  //     );
  // }

  getPredictedPrices24(): void {
    this.dataService.getPredictedPrices24Carats('2024-06-02', '2025-05-11')
      .subscribe(
        (response: any) => {
          this.predictedPrices24 = this.sanitizeData(response);
          console.log('Predicted Prices 24carat:', this.predictedPrices24);

          this.lineChartData24 = [
            {
              name: '24k Gold Per Gram Predicted Price',
              series: this.predictedPrices24.map(item => ({
                name: item.start_date,
                value: item.Predicted_Buy_Price
              }))
            }
          ];
        },
        (error: any) => {
          console.error('Error fetching predicted prices for 24 carats:', error);
        }
      );
  }

  getPredictedPricesSilver(): void {
     this.dataService.getPredictedSilverPrice('2024-06-01', '2025-04-16')
      .subscribe(
        (response: any) => {
          this.predictedPricesSilver = this.sanitizeData(response);
          console.log('Predicted Prices Silver:', this.predictedPricesSilver);

          this.lineChartDataSilver = [
            {
              name: 'Silver Per KG Predicted Price',
              series: this.predictedPricesSilver.map(item => ({
                name: item.start_date,
                value: item.Predicted_Buy_Price
              }))
            }
          ];
        },
        (error: any) => {
          console.error('Error fetching predicted prices for Silver:', error);
        }
      );
  }

  sanitizeData(data: any[]): any[] {
    return data.map(item => ({
      ...item,
      Predicted_Buy_Price: this.sanitizeValue(item.Predicted_Buy_Price)
    }));
  }

  sanitizeValue(value: number): number {
    return (isNaN(value) || !isFinite(value)) ? 0 : value;
  }

}
