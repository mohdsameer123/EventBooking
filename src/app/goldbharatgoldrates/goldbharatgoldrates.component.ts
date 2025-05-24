import { Component } from '@angular/core';
import { HomeService } from '../services/home.service';
import { Subscription, debounceTime, interval, switchMap } from 'rxjs';
import { WebSocketService } from '../services/web-socket.service';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-goldbharatgoldrates',
  templateUrl: './goldbharatgoldrates.component.html',
  styleUrls: ['./goldbharatgoldrates.component.scss'],
})
export class GoldbharatgoldratesComponent {

  livePrice: any;
  spotGold: any;
  spotSilver: any;
  spotINR: any;
  primium: any;
  spotGoldUpdate: any;
  spotSilverUpdate: any;
  isGold: boolean = true;
  previousSpotSilverUpdate: any;
  spotSilverColor!: string;
  constructor(
    private home: HomeService,
    private webSocketService: WebSocketService,
    private toast: NgToastService,
    private spinner: NgxSpinnerService,
    private http: HttpClient
  ) {
    // Get current date and time
    const now = new Date();

    // Format time (HH:mm:ss)
    const hours = this.padZero(now.getHours());
    const minutes = this.padZero(now.getMinutes());
    const seconds = this.padZero(now.getSeconds());
    this.currentTime = `${hours}:${minutes}:${seconds}`;

    // Get current day (Sunday, Monday, etc.)
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    this.currentDay = days[now.getDay()];

    // Format date (DD-MM-YYYY)
    const date = now.getDate();
    const month = now.getMonth() + 1; // Months are zero-based
    const year = now.getFullYear();
    this.currentDate = `${this.padZero(date)}-${this.padZero(month)}-${year}`;
  }
  currentTime: string;
  currentDay: string;
  currentDate: string;

  private padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
  data: string | undefined;
  private socketSubscription: Subscription | undefined;
  private livePriceSubscription: Subscription | undefined;

  ngOnInit(): void {
    // this.spinner.show();

    // this.spinner.show();

    // Hide spinner after 3 seconds
    // setTimeout(() => {
    //   this.spinner.hide();
    // }, 2000);
    this.spotGoldUpdate = 0;
    this.spotSilverUpdate = 0;
    this.previousSpotGoldUpdate = 0;
    this.previousSpotINRUpdate = 0;
    this.previousSpotSilverUpdate = 0;

    // Initialize spotGoldColor
    this.spotGoldColor = 'black'; // Default color
    this.spotSilverColor = 'black'; // Default color
    this.spotINRColor = 'black';
    // this.primium = 1.50;
    this.socketSubscription = this.webSocketService
      .startFetching()
      .pipe(debounceTime(500))
      .subscribe(
        (message: string) => {
          this.handleWebSocketMessage(message);
        },
        (error: any) => {
          // console.error('WebSocket error:', error);
        }
      );
  }
  previousSpotGoldUpdate: any;
  previousSpotINRUpdate: any;
  spotGoldColor!: string;
  spotINRColor: any;
  private handleWebSocketMessage(message: string): void {
    this.http.get('https://liverates-api.goldcentral.in/api/getpremium').subscribe(
      (res: any) => {
        // this.spinner.hide();
        if (res && res.premium !== undefined) {
          this.primium = res.premium;
        } else {
          console.error('Invalid premium response:', res);
        }
      },
      (error: any) => {
        console.error('Error fetching premium:', error);
      }
    );
    this.data = message;
    try {
      const jsonMessage = JSON.parse(message.substring(2));
      const eventData = jsonMessage[1].updatedata;
      const jsonData = JSON.parse(eventData);
      const filteredData = jsonData.filter(
        (item: any) =>
          item.gold1_symbol === 'SPOT-INR' ||
          item.gold1_symbol === 'SPOT-SILVER' ||
          item.gold1_symbol === 'SPOT-GOLD'
      );
      this.spotGold = filteredData[0].gold1_ask;
      this.spotSilver = filteredData[1].gold1_ask;
      this.spotINR = filteredData[2].gold1_ask;

      const ozToGrams = 31.102;
      const GOV_GOLD_TAX = 6.25;
      const GOV_SILVER_TAX = 10.75;
      const GST_TAX_PERCENTAGE = 0;

      const gt = GOV_GOLD_TAX + GST_TAX_PERCENTAGE;
      const totalChargesPercentage = gt;

      const gt_silver = GOV_SILVER_TAX + GST_TAX_PERCENTAGE;
      const totalChargesSilverPercentage = gt_silver;

      const checkGold1 = this.spotGold / ozToGrams;
      const INRrupeeGold = checkGold1 * this.spotINR;
      let convGold: number =
        (INRrupeeGold / 100) * totalChargesPercentage + INRrupeeGold;
      convGold += (convGold * this.primium) / 100;
      this.spotGoldUpdate = (convGold+10).toFixed(2);

      const checkSilver = (this.spotSilver / 31.1) * this.spotINR * 1000;
      const inrSilver = checkSilver + (checkSilver / 100) * 10.75;

      const finalSilver = (inrSilver + 4000)/100;

      this.spotSilverUpdate = (finalSilver + 10).toFixed(2);
      // Update spotGoldColor based on comparison

      // Update spotGoldColor based on comparison
      if (
        parseFloat(this.spotGoldUpdate) >
        parseFloat(this.previousSpotGoldUpdate)
      ) {
        this.spotGoldColor = '#03fc2c';
      } else if (
        parseFloat(this.spotGoldUpdate) <
        parseFloat(this.previousSpotGoldUpdate)
      ) {
        this.spotGoldColor = 'red';
      } else {
        this.spotGoldColor = '#ffff00'; // No change
      }
      if (parseFloat(this.spotINR) > parseFloat(this.previousSpotINRUpdate)) {
        this.spotINRColor = '#03fc2c';
      } else if (
        parseFloat(this.spotINR) < parseFloat(this.previousSpotINRUpdate)
      ) {
        this.spotINRColor = 'red';
      } else {
        this.spotINRColor = '#ffff00'; // No change
      }

      // Update spotSilverColor based on comparison
      if (
        parseFloat(this.spotSilverUpdate) >
        parseFloat(this.previousSpotSilverUpdate)
      ) {
        this.spotSilverColor = '#03fc2c';
      } else if (
        parseFloat(this.spotSilverUpdate) <
        parseFloat(this.previousSpotSilverUpdate)
      ) {
        this.spotSilverColor = 'red';
      } else {
        this.spotSilverColor = 'rgba(214, 217, 223, 0.8)'; // No change
      }

      // Update previousSpotGoldUpdate and previousSpotSilverUpdate
      this.previousSpotSilverUpdate = this.spotSilverUpdate;
      this.previousSpotGoldUpdate = this.spotGoldUpdate;
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  }

  ngOnDestroy(): void {
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
    if (this.livePriceSubscription) {
      this.livePriceSubscription.unsubscribe();
    }
  }
}
