import { Component, ElementRef, ViewChild } from '@angular/core';
import { HomeService } from '../services/home.service';
import { Subscription, debounceTime, interval, switchMap, timer } from 'rxjs';
import { WebSocketService } from '../services/web-socket.service';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupDialogComponent } from '../popup-dialog/popup-dialog.component';
import { ConfigService } from '../services/config.service';
import { Meta, Title } from '@angular/platform-browser';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent {
  @ViewChild('exampleModalGold', { static: false }) modalElement!: ElementRef;
  // modal = new Modal(this.modalElement.nativeElement);

  showDiv = {
    previous: true,
    current: true,
    next: true,
  };
  livePrice: any;
  spotGold: any;
  spotSilver: any;
  spotINR: any;
  primium: any = 0;
  spotGoldUpdate: any;
  spotSilverUpdate: any;
  isGold: boolean = true;
  previousSpotSilverUpdate: any;
  spotSilverColor!: string;
  isLogin: any;
  isNotAllowedTime: boolean = true;
  fAmount!: number;
  buyGolgForm: FormGroup;
  bookSilverForm: FormGroup;
  isTotal: boolean = false;
  isAmountLessThan110: boolean = false;
  isAmountLessThan1000: boolean = false;
  goldMaxLimit: any;
  silverMaxLimit: any;
  kyc_status: any;
  silverPrimium: any = 0;
  treding!: boolean;
  isWeekendDay: boolean = false;
  // now!: Date;
  phoneNumbers: string[] = [];
  timings: string = '';
  whatsappNumber: string = '';
  email: string = '';
  address: string = '';
  companyname: any;
  backGroundColor: any;
  colorChangeTimeout: any;
  usrID: any;
  profileDetails: any;
  timingsData: any;
  shouldShowAlert: boolean = false;
  buySilverRate: any;
  buyGoldRate: any;

  timerBuy: number = 30;
  timerSubscriptionBuy: Subscription | null = null;
  stayBuyGoldRate: any;
  stayBuySilverRate: any;

  constructor(
    private home: HomeService,
    private webSocketService: WebSocketService,
    private toast: NgToastService,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    public dialog: MatDialog,
    private configService: ConfigService,
    private meta: Meta,
    private titleService: Title
  ) {
    this.bookGolgForm = this.fb.group({
      product_name: [''],
      quantity_purchased: ['', [Validators.required]],
      book_rate: [
        '',
        [
          Validators.required,
          Validators.pattern('^\\d*\\.?\\d*$'),
          Validators.maxLength(4),
          Validators.minLength(4),
        ],
      ],
      order_type: [''],
    });
    this.bookSilverForm = this.fb.group({
      product_name: [''],
      quantity_purchased: ['', [Validators.required]],
      book_rate: [
        '',
        [
          Validators.required,
          Validators.pattern('^\\d*\\.?\\d*$'),
          Validators.maxLength(6),
          Validators.minLength(5),
        ],
      ],
      order_type: [''],
    });
    this.buyGolgForm = this.fb.group({
      product_name: [''],
      quantity_purchased: ['', [Validators.required]],
      purchased_price: [''],
      order_type: [''],
    });
  }
  now: Date = new Date();

  bookGolgForm!: FormGroup;
  updateTime(): void {
    this.now = new Date();
  }
  isWeekend() {
    this.now = new Date();
    const isToday = this.now.toLocaleString('en-us', { weekday: 'short' });

    if (this.kyc_status !== 2) {
      if (isToday === 'Sat' || isToday === 'Sun') {
        this.treding = false; // Disable booking/buying on weekends
        this.isWeekendDay = true; // Enable the message for weekends
      } else {
        this.treding = true; // Enable booking/buying on weekdays
        this.isWeekendDay = false; // Disable the message for weekdays
      }
    } else {
      // For statusCode other than 2, treat all days as weekdays (booking/buying enabled)
      this.treding = true; // Enable booking/buying for all days
      this.isWeekendDay = false; // Disable the weekend message
    }
  }

  checkTime(): void {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentDay = now.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6

    // Define time ranges: before 9:30 AM or after 11:30 PM
    const isBefore930AM =

      currentHour < 9 || (currentHour === 9 && currentMinute < 30);
    const isAfter1130PM =

      currentHour > 23 || (currentHour === 23 && currentMinute >= 30);

    // Check if today is Monday to Friday (Day 1 to 5)
    const isWeekday = currentDay >= 1 && currentDay <= 5;

    // Set the alert visibility
    this.shouldShowAlert = (isBefore930AM || isAfter1130PM) && isWeekday;
  }

  userAmount(userInput: any) {
    if (userInput.length == 4) {
      let diffAmount = this.spotGoldUpdate - 110;
      if (diffAmount < userInput) {
        this.isAmountLessThan110 = true;
      } else {
        this.isAmountLessThan110 = false;
        this.toast.warning({
          detail: 'Only less than Rs.110 accepted',
          summary:
            'Please enter an amount that is only Rs.110 less than the live rate.',
          position: 'topCenter',
        });
      }
    }
    // else{
    //   this.bookGolgForm.setValue({book_rate:null})
    // }
  }
  userAmountSilver(userInput: any) {
    if (userInput.length == 6) {
      let diffAmount = this.spotSilverUpdate - 1000;
      if (diffAmount < userInput) {
        this.isAmountLessThan1000 = true;
      } else {
        this.isAmountLessThan1000 = false;
        this.toast.warning({
          detail: 'Only less than Rs.1000 accepted',
          summary:
            'Please enter an amount that is only Rs.1000 less than the live rate.',
          position: 'topCenter',
        });
      }
    }
  }
  checkLogIn() {
    this.toast.warning({
      detail: 'Login Required!',
      summary: 'Please login for book gold',
      position: 'topCenter',
    });
  }
  onBuySubmit(value: string) {
    if (value === 'Gold') {
      this.buyGolgForm.get('product_name')?.setValue('Gold');
      this.buyGolgForm.get('order_type')?.setValue('Gold');
      let selectedQuantity = this.buyGolgForm.get('quantity_purchased')?.value;
      // let fianlAmountGold:any = selectedQuantity * this.spotGoldUpdate
      this.buyGolgForm
        .get('purchased_price')
        ?.setValue(parseFloat(this.stayBuyGoldRate));
    } else {
      this.buyGolgForm.get('product_name')?.setValue('Silver');
      this.buyGolgForm.get('order_type')?.setValue('Silver');
      let selectedQuantity = this.buyGolgForm.get('quantity_purchased')?.value;
      // let fianlAmountGold :any= selectedQuantity * this.spotSilverUpdate
      this.buyGolgForm
        .get('purchased_price')
        ?.setValue(parseFloat(this.stayBuySilverRate));
    }
    this.home.buyGoldAnsSilver(this.buyGolgForm.value).subscribe(
      (res: any) => {
        this.toast.success({
          detail: 'Success!',
          summary: res.msg,
          position: 'topCenter',
        });
        this.buyGolgForm.reset();
        this.goldLimit();
        this.silverLimit();
      },
      (err) => {
        this.toast.error({
          detail: 'Ooops!',
          summary: err.error.msg,
          position: 'topCenter',
        });
      }
    );
  }
  onGoldSubmit(value: string) {
    if (value === 'gold') {
      this.bookGolgForm.get('product_name')?.setValue('Gold');
      this.bookGolgForm.get('order_type')?.setValue('Gold');

      this.home.bookGoldAndSilver(this.bookGolgForm.value).subscribe(
        (res: any) => {
          this.toast.success({
            detail: 'Success!',
            summary: res.msg,
            position: 'topCenter',
          });
          this.bookGolgForm.reset();
          this.goldLimit();
          this.silverLimit();
        },
        (err) => {
          this.toast.error({
            detail: 'Ooops!',
            summary: err.error.msg,
            position: 'topCenter',
          });
        }
      );
    } else {
      this.bookSilverForm.get('product_name')?.setValue('Silver');
      this.bookSilverForm.get('order_type')?.setValue('Silver');

      this.home.bookGoldAndSilver(this.bookSilverForm.value).subscribe(
        (res: any) => {
          this.toast.success({
            detail: 'Success!',
            summary: res.msg,
            position: 'topCenter',
          });
          this.bookSilverForm.reset();
        },
        (err) => {
          this.toast.error({
            detail: 'Ooops!',
            summary: err.error.msg,
            position: 'topCenter',
          });
        }
      );
    }
  }
  data: string | undefined;
  public socketSubscription!: Subscription;
  public livePriceSubscription!: Subscription;
  openDialog(): void {
    this.dialog.open(PopupDialogComponent, {
      width: '500px', // Adjust the width as needed
      panelClass: 'custom-dialog-container', // Add a custom class for further styling
    });
  }
  ngOnInit(): void {
    //11:30 buttns hidin
    this.getTimingsbyId();
    this.checkLoginAndTime();

    this.checkTime();

    // Set the title
    this.titleService.setTitle(
      'Buy Gold & Silver In Bulk At Best Price | Goldbharat'
    );

    // Set meta tags for description and keywords
    this.meta.updateTag({
      name: 'description',
      content:
        'Buy bulk gold and silver at unbeatable prices. Secure your wealth with high-quality precious metals, ideal for investors seeking long-term reliability and value protection.',
    });
    this.meta.updateTag({
      name: 'keywords',
      content:
        'buy gold wholesale, buy gold in bulk, buy gold wholesale direct, gold price today',
    });
    // Fetch initial rates
    this.home.getInitialRates().subscribe((data) => {
      this.spotGoldUpdate = data.carat24.sell_price_per_gram;
      this.spotSilverUpdate = data.silverPrice.sell_price_per_gram;
      this.spotGold = data.carat24.spot_gold;
      console.log('sotSilver', this.spotSilverUpdate);
      this.spotGold = data.carat24.spot_gold;
      this.spotSilver = data.silverPrice.spot_silver;
      this.spotINR = data.carat24.spot_inr; //
    });
    // this.openDialog();
    this.isWeekend();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0); // Scrolls to the top of the page
      }
    });
    // this.userProfile()
    // let log: any = localStorage.getItem('user-token-goldBharatFirst');
    // this.isLogin = JSON.parse(log);

    this.timeSubscription = interval(1000).subscribe(() => {
      this.updateTime();
    });

    this.spotGoldUpdate = 0;
    this.spotSilverUpdate = 0;

    this.previousSpotGoldUpdate = 0;
    this.previousSpotINRUpdate = 0;
    this.previousSpotSilverUpdate = 0;

    // Initialize spotGoldColor
    this.spotGoldColor = '#e1b737'; // Default color
    this.spotSilverColor = '#e1b737'; // Default color
    this.spotINRColor = '#e1b737';   //#e1b737
    // this.primium = 1.50;
    this.socketSubscription = this.webSocketService
      .startFetching()
      .pipe(debounceTime(500))
      .subscribe(
        (message: string) => {
          this.handleWebSocketMessage(message);
          console.log('websocket', this.handleWebSocketMessage(message));
        },
        (error: any) => {}
      );
    // this.socketSubscription = this.webSocketService.startFetching().subscribe(
    //   (message: string) => {
    //     this.handleWebSocketMessage(message);
    //   },
    //   (error: any) => {
    //     console.error('Error in WebSocket subscription:', error);
    //   }
    // );
    console.log('outside the config file');

    this.configService.loadConfig().subscribe(
      (config) => {
        if (config && config.contact) {
          console.log('inside the config file');
          this.phoneNumbers = config.contact.phoneNumbers;
          this.timings = config.contact.timings;
          this.whatsappNumber = config.contact.whatsappNumber;
          this.email = config.contact.email;
          this.address = config.contact.address;
          this.companyname = config.company.companyname;
          this.backGroundColor = config.company;
        } else {
          console.error('Config or config.contact is undefined', config);
        }
      },
      (error) => {
        console.error('Error fetching config:', error);
      }
    );
  }
  checkLoginAndTime() {
    // Validate user login status
    const log: any = localStorage.getItem('user-token-goldBharatFirst');
    this.isLogin = JSON.parse(log);
    console.log(this.isLogin);
    // this.getTimingsbyId()

    // Check if current time is outside 11:30 PM to 5:00 AM
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Set isNotAllowedTime to false if within restricted time range, otherwise true
    this.isNotAllowedTime = !(
      (currentHour === 23 && currentMinute >= 30) ||
      (currentHour >= 0 && currentHour < 9) ||
      (currentHour === 9 && currentMinute < 30)
    );

    // Load user profile only if logged in and outside restricted time range
    if (this.isLogin && this.isNotAllowedTime) {
      this.userProfile();
      // this.getTimingsbyId();
    }
  }

  previousSpotGoldUpdate: any;
  previousSpotINRUpdate: any;
  spotGoldColor!: string;
  spotINRColor: any;
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
    this.http
      .get('https://liverates-api.goldcentral.in/api/getpremium')
      .subscribe(
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
    this.http
      .get('https://liverates-api.goldcentral.in/api/getSilverPremium')
      .subscribe(
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
    let convGold: number =
      (INRrupeeGold / 100) * totalChargesPercentage + INRrupeeGold;
    convGold += (convGold * this.primium) / 100;
    this.spotGoldUpdate = convGold.toFixed(2);

    // Silver price calculation
    const checkSilver = (this.spotSilver / 31.1) * this.spotINR * 1000;
    const inrSilver = checkSilver + (checkSilver / 100) * 6.75;
    const finalSilver = inrSilver + (inrSilver * this.silverPrimium) / 1000;
    this.spotSilverUpdate = (finalSilver + 100).toFixed(2);

    // Update colors based on comparison
    this.spotGoldColor = this.getColor(
      this.spotGoldUpdate,
      this.previousSpotGoldUpdate
    );
    this.spotINRColor = this.getColor(this.spotINR, this.previousSpotINRUpdate);
    this.spotSilverColor = this.getColor(
      this.spotSilverUpdate,
      this.previousSpotSilverUpdate
    );

    // Update previous values
    setTimeout(() => {
      this.previousSpotGoldUpdate = this.spotGoldUpdate;
      this.previousSpotSilverUpdate = this.spotSilverUpdate;
      this.previousSpotINRUpdate = this.spotINR;
    }, 100);

  }


  // Method to check if the current day is Saturday or Sunday
  public isWeekendCheck(): boolean {
    const currentDay = new Date().getDay(); // Get the current day of the week (0 = Sunday, 6 = Saturday)
    return currentDay === 0 || currentDay === 6; // Returns true if it's Sunday (0) or Saturday (6)
  }

  private lastUpdated: number = 0; // To track the last update time
  private colorUpdateTimeout: any; // To hold the timeout reference

  // Get color based on the current and previous price difference
  private resetColor(): void {
    this.lastUpdated = 0;
  }
  private getColor(
    current: number | string,
    previous: number | string,
    threshold: number = 0.06
  ): string {
    const currentNum =
      typeof current === 'string' ? parseFloat(current) : current;
    const previousNum =
      typeof previous === 'string' ? parseFloat(previous) : previous;

    if (currentNum > previousNum) {
      return '#FE4A54';
    } else if (currentNum < previousNum) {
      return '#76f590';
    } else {
      return '#e1b737';
    }
  }

  private timeSubscription: Subscription | undefined;

  ngOnDestroy(): void {
    // Fetch initial rates

    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
    if (this.livePriceSubscription) {
      this.livePriceSubscription.unsubscribe();
    }
    if (this.timerSubscriptionBuy) {
      this.timerSubscriptionBuy.unsubscribe();
    }
  }
  callLimit(value: string) {
    if (value === 'Gold') {
      this.goldLimit();
      this.goldSilverRateStay();
      this.timerBuy = 30;
      this.startTimer();
    } else {
      this.silverLimit();
      this.goldSilverRateStay();
      this.timerBuy = 30;
      this.startTimer();
    }
  }
  goldLimit() {
    this.home.getGoldLimit().subscribe((res: any) => {
      this.goldMaxLimit = res.maxLimitValues;
    });
  }
  silverLimit() {
    this.home.getSilverLimit().subscribe((res: any) => {
      this.silverMaxLimit = res.silverMaxLimitValues;
    });
  }
  userProfile() {
    this.auth.userDetailGet().subscribe((res: any) => {
      this.kyc_status = res.kyc_status;
      this.profileDetails = res;
      console.log(this.profileDetails);
      localStorage.setItem('userData', JSON.stringify(res));
      this.getTimingsbyId();
      // this.getTimingsbyId();
    });
  }

  // updateKyx() {
  //   const modalElement = document.getElementById('updateKyx');
  //   const modalInstance = new Modal(modalElement!);
  //   modalInstance.show();
  // }

  getWhatsAppLink(number: string): string {
    const formattedNumber = number.replace(/\D/g, '');
    return `https://wa.me/${formattedNumber}`;
  }

  getTimingsbyId() {
    const userDetails = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!userDetails.id) {
      console.error('User ID not found in localStorage');
      return;
    }
    console.log(userDetails)
    const userID = userDetails.id;
    if(userDetails.kyc_status !== 0){
      this.home.getTimings(userID).subscribe({
        next: (response) => {
          this.timingsData = response; // Store the response in a variable
          console.log('API Response:', this.timingsData);
        },
        error: (err) => {
          console.error('Error fetching timings:', err);
        },
      });
    }

  }

  // ngOnDestroy() {
  //   if (this.timerSubscription) {
  //     this.timerSubscription.unsubscribe();
  //   }
  // }

  goldSilverRateStay() {
    this.home.getInitialRates().subscribe((data) => {
      this.stayBuyGoldRate = data.carat24.sell_price_per_gram;
      this.stayBuySilverRate = data.silverPrice.sell_price_per_gram;
      // this.spotGoldUpdate = this.buyGoldRate;
      // this.spotSilverColor = this.buyGoldRate > 0 ? 'green' : 'red'; // Example condition
    });
  }

  startTimer() {
    this.timerSubscriptionBuy = interval(1000).subscribe(() => {
      this.timerBuy--;

      if (this.timerBuy <= 0) {
        this.timerBuy = 30; // Reset the timer
        this.goldSilverRateStay(); // Fetch updated rates
        window.location.reload();
      }
    });
  }

  stopTimer() {
    if (this.timerSubscriptionBuy) {
      this.timerSubscriptionBuy.unsubscribe();
      this.timerSubscriptionBuy = null;
    }
  }

  closeModal() {
    this.stopTimer();
  }
}
