import { NgModule,APP_INITIALIZER  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomepageComponent } from './homepage/homepage.component';
import { HeaderpageComponent } from './headerpage/headerpage.component';
import { FooterpageComponent } from './footerpage/footerpage.component';
import { LayoutComponent } from './layout/layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgToastModule } from 'ng-angular-popup';
import { NgOtpInputModule } from 'ng-otp-input';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MobileviewComponent } from './mobileview/mobileview.component';
import { GoldbharatgoldratesComponent } from './goldbharatgoldrates/goldbharatgoldrates.component';
import { LiverateComponent } from './liverate/liverate.component';
import { LoacteusComponent } from './loacteus/loacteus.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { InterceptohttpInterceptor } from './interceptohttp.interceptor';
import { ProprietorkycComponent } from './proprietorkyc/proprietorkyc.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ProductsComponent } from './products/products.component';
import { OrdersComponent } from './orders/orders.component';
import { NumberFormatPipe } from './services/number-format.pipe';
import { RatealertComponent } from './ratealert/ratealert.component';
import { BookingComponent } from './booking/booking.component';
import { ChartComponent } from './chart/chart.component';
import { MarginComponent } from './margin/margin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomDateTimePipe } from './services/custom-date-time.pipe';
import { DatePipe } from '@angular/common';
import { LayoutmobileComponent } from './layoutmobile/layoutmobile.component';
import { HeadermobileComponent } from './mobilecomponent/headermobile/headermobile.component';
import { FootermobileComponent } from './mobilecomponent/footermobile/footermobile.component';
import { MenuComponent } from './mobilecomponent/menu/menu.component';
import { ProfileComponent } from './mobilecomponent/profile/profile.component';
import { PopupDialogComponent } from './popup-dialog/popup-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NotificationsComponent } from './notifications/notifications.component';
import { ConfigService } from './services/config.service';
import { Title,Meta  } from '@angular/platform-browser';
import { PredictionsComponent } from './predictions/predictions.component';
import { MatCardModule } from '@angular/material/card';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GoldratehistoryComponent } from './goldratehistory/goldratehistory.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SetBusinessTimingsComponent } from './set-business-timings/set-business-timings.component';
export function loadConfig(configService: ConfigService) {
  return () => configService.loadConfig().toPromise();
}
export function initializeApp(configService: ConfigService) {
  return (): Promise<any> => {
    return configService.loadConfig().toPromise().then(config => {
      configService.setConfig(config);
    });
  };
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomepageComponent,
    HeaderpageComponent,
    FooterpageComponent,
    LayoutComponent,
    MobileviewComponent,
    GoldbharatgoldratesComponent,
    LiverateComponent,
    LoacteusComponent,
    PrivacypolicyComponent,
    ProprietorkycComponent,
    AboutusComponent,
    ProductsComponent,
    OrdersComponent,
    NumberFormatPipe,
    RatealertComponent,
    BookingComponent,
    ChartComponent,
    MarginComponent,
    CustomDateTimePipe,
    LayoutmobileComponent,
    HeadermobileComponent,
    FootermobileComponent,
    MenuComponent,
    ProfileComponent,
    PopupDialogComponent,
    NotificationsComponent,
    PredictionsComponent,
    GoldratehistoryComponent,
    SetBusinessTimingsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    NgToastModule,
    MatDialogModule,
    NgOtpInputModule,
    NgxSpinnerModule.forRoot(),
    NgxChartsModule,
    MatCardModule,
    NgxPaginationModule
  ],
  providers: [DatePipe,
    {
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptohttpInterceptor,
    multi: true
   },
   { provide: APP_INITIALIZER, useFactory: loadConfig, deps: [ConfigService], multi: true },
   Title,
   Meta,
   { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [ConfigService], multi: true }

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

