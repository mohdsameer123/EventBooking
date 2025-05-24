import { Component } from '@angular/core';
import { Subscription, debounceTime } from 'rxjs';
import { HomeService } from '../services/home.service';
import { WebSocketService } from '../services/web-socket.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-ratealert',
  templateUrl: './ratealert.component.html',
  styleUrls: ['./ratealert.component.scss']
})
export class RatealertComponent {
  public socketSubscription!: Subscription
  public livePriceSubscription!: Subscription
  data: string | undefined;
  spotGold: any;
  spotSilver: any;
  spotINR: any;
  spotGoldUpdate: any;
  spotSilverUpdate: any;
  previousSpotGoldUpdate: any;
  spotGoldColor!: string;
  spotSilverColor!: string;
  primium: any;
  previousSpotSilverUpdate: any;
  isGold:boolean=true;
rateAlertForm!:FormGroup;
  silverPrimium: any;
  config: any;
  rateAlert: any;
constructor(private home: HomeService,
  private webSocketService: WebSocketService,
  private http: HttpClient,
private fb:FormBuilder,
private toast: NgToastService, private configService: ConfigService){}
ngOnInit():void{
  this.home.getInitialRates().subscribe(data => {
    this.spotGoldUpdate = data.carat24.sell_price_per_gram;
     this.spotSilverUpdate = data.silverPrice.sell_price_per_gram;
     this.spotGold=data.carat24.spot_gold
    console.log("sotSilver", this.spotSilverUpdate);
    this.spotGold = data.carat24.spot_gold;
    this.spotSilver=data.silverPrice.spot_silver;
    this.spotINR = data.carat24.spot_inr; //

  });
  this.formInit()
  this.spotGoldUpdate = 0;
  this.spotSilverUpdate = 0;
  this.previousSpotGoldUpdate = 0;
  this.spotSilverUpdate = 0;
  this.previousSpotSilverUpdate=0;

   // Initialize spotGoldColor
   this.spotGoldColor = 'White'; // Default color
   this.spotSilverColor = 'White'; // Default color
   // this.primium = 1.50;
   this.socketSubscription = this.webSocketService
     .startFetching()
     .pipe(debounceTime(500))
     .subscribe(
       (message: string) => {
         this.handleWebSocketMessage(message);
       },
       (error: any) => {
         console.error('WebSocket error:', error);
       }
     );



     this.configService.loadConfig().subscribe(config => {
      this.config = config.atRegistrationPage?.labelColor;

    });

    const config = this.configService.getConfig();
    if (config && config.bookingPage  ) {
      this.rateAlert = config.rateAlert;
    }

}
private handleWebSocketMessage(message: string): void {
  this.data = message;

  try {
    const jsonMessage = JSON.parse(message.substring(2));
    const eventData = jsonMessage[1].updatedata;
    const jsonData = JSON.parse(eventData);
    const filteredData = this.filterData(jsonData);

    if (filteredData.length === 3) {
      this.spotGold = filteredData[0].gold1_ask;
      this.spotSilver = filteredData[1].gold1_ask;
      this.spotINR = filteredData[2].gold1_ask;

      this.fetchPremiums();
    } else {
      console.error('Unexpected data format:', filteredData);
    }
  } catch (error) {
    console.error('Error parsing message:', error);
  }
}

private filterData(data: any[]): any[] {
  return data.filter(
    (item: any) =>
      item.gold1_symbol === 'SPOT-INR' ||
      item.gold1_symbol === 'SPOT-SILVER' ||
      item.gold1_symbol === 'SPOT-GOLD'
  );
}

private fetchPremiums(): void {
  this.http.get('https://liverates-api.goldcentral.in/api/getpremium').subscribe(
    (res: any) => {
      if (res && res.premium !== undefined) {
        this.primium = res.premium;
        this.fetchSilverPremium();
      } else {
        console.error('Premium data is undefined');
      }
    },
    (error: any) => {
      console.error('Error fetching premium:', error);
    }
  );
}

private fetchSilverPremium(): void {
  this.http.get('https://liverates-api.goldcentral.in/api/getSilverPremium').subscribe(
    (res: any) => {
      if (res && res.premium !== undefined) {
        this.silverPrimium = res.premium;
        this.calculateUpdatedPrices();
      } else {
        console.error('Silver premium data is undefined');
      }
    },
    (error: any) => {
      console.error('Error fetching silver premium:', error);
    }
  );
}

private calculateUpdatedPrices(): void {
  const ozToGrams = 31.102;
  const GOV_GOLD_TAX = 6.25;
    const GOV_SILVER_TAX = 6.75;
  const GST_TAX_PERCENTAGE = 0;

  const totalChargesPercentage = GOV_GOLD_TAX + GST_TAX_PERCENTAGE;
  const totalChargesSilverPercentage = GOV_SILVER_TAX + GST_TAX_PERCENTAGE;

  // Gold price calculation
  const checkGold1 = this.spotGold / ozToGrams;
  const INRrupeeGold = checkGold1 * this.spotINR;
  let convGold: number = (INRrupeeGold / 100) * totalChargesPercentage + INRrupeeGold;
  convGold += (convGold * this.primium) / 100;
  this.spotGoldUpdate = convGold.toFixed(2);

  // Silver price calculation
  const checkSilver = (this.spotSilver / 31.1) * this.spotINR * 1000;
  const inrSilver = checkSilver + (checkSilver / 100) * 6.75;
  const finalSilver = inrSilver + (inrSilver * this.silverPrimium) / 1000;
  this.spotSilverUpdate = (finalSilver + 100).toFixed(2);

  // Update colors based on comparison
  this.spotGoldColor = this.getColor(this.spotGoldUpdate, this.previousSpotGoldUpdate);
  this.spotSilverColor = this.getColor(this.spotSilverUpdate, this.previousSpotSilverUpdate);

  // Update previous values
  this.previousSpotGoldUpdate = this.spotGoldUpdate;
  this.previousSpotSilverUpdate = this.spotSilverUpdate;
}

private getColor(current: number | string, previous: number | string): string {
  const currentNum = typeof current === 'string' ? parseFloat(current) : current;
  const previousNum = typeof previous === 'string' ? parseFloat(previous) : previous;

  if (currentNum > previousNum) {
    return '#FE4A54';
  } else if (currentNum < previousNum) {
    return '#1DC7AC';
  } else {
    return '#e1b737';
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
formInit(){
  this.rateAlertForm=this.fb.group({
    book_rate:['',[Validators.required,Validators.pattern('^[0-9]{4,5}$')]],
    order_type:['Gold',[Validators.required]]

    
  })
}



isTypeGold(event:any){
  this.rateAlertForm.patchValue({ book_rate: '' });
  if(event.target.value==='Gold'){
  this.isGold=true
}
else{
  this.isGold=false;
}
}
onSubmit(){
  this.home.postAlertrate(this.rateAlertForm.value).subscribe((res:any)=>{
    this.toast.success({ detail: 'Success!', summary: res.msg, position: 'topCenter' });
    this.rateAlertForm.reset()
  },
err=>{
  this.toast.error({ detail: 'Ooops!', summary: 'You need to Complete your KYC', position: 'topCenter' });

})

}
}