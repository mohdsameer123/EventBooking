import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LayoutComponent } from './layout/layout.component';
import { MobileviewComponent } from './mobileview/mobileview.component';
import { GoldbharatgoldratesComponent } from './goldbharatgoldrates/goldbharatgoldrates.component';
import { LiverateComponent } from './liverate/liverate.component';
import { LoacteusComponent } from './loacteus/loacteus.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { ProprietorkycComponent } from './proprietorkyc/proprietorkyc.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ProductsComponent } from './products/products.component';
import { OrdersComponent } from './orders/orders.component';
import { RatealertComponent } from './ratealert/ratealert.component';
import { BookingComponent } from './booking/booking.component';
import { MarginComponent } from './margin/margin.component';
import { ChartComponent } from './chart/chart.component';
import { KycDetailsComponent } from './kyc-details/kyc-details.component';
import { AuthGuard } from './services/guard.guard';
import { LayoutmobileComponent } from './layoutmobile/layoutmobile.component';
import { HeadermobileComponent } from './mobilecomponent/headermobile/headermobile.component';
import { MenuComponent } from './mobilecomponent/menu/menu.component';
import { ProfileComponent } from './mobilecomponent/profile/profile.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PredictionsComponent } from './predictions/predictions.component';
import { GoldratehistoryComponent } from './goldratehistory/goldratehistory.component';
import { SetBusinessTimingsComponent } from './set-business-timings/set-business-timings.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // { path: 'mobileview', component: MobileviewComponent },
  // { path: 'atmrates', component: GoldbharatgoldratesComponent },
  // { path: 'liverates', component: LiverateComponent },
  // { path: 'rate-alert-mobile', component: RatealertComponent },

  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomepageComponent, pathMatch: 'full' },
      { path: 'home', component: HomepageComponent },
      { path: 'locateus', component: LoacteusComponent },
      { path: 'policy', component: PrivacypolicyComponent },
      { path: 'update-kyc', component: ProprietorkycComponent },
      { path: 'aboutus', component: AboutusComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'predictions',component: PredictionsComponent },
      { path: 'history', component: GoldratehistoryComponent},
       { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
      { path: 'rate-alert', component: RatealertComponent, canActivate: [AuthGuard] },
      { path: 'Booking', component: BookingComponent },
      { path: 'margin', component: MarginComponent, canActivate: [AuthGuard] },
      { path: 'chart', component: ChartComponent, canActivate: [AuthGuard] },
      { path: 'kyc_details', component: KycDetailsComponent, canActivate: [AuthGuard] },
      { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },
      { path: 'setTimings', component: SetBusinessTimingsComponent, canActivate: [AuthGuard] },

    ],
  },
  {
    path: 'mobile',
    component: LayoutmobileComponent,
    children: [
      { path: '', component: MobileviewComponent, pathMatch: 'full' },

      { path: 'mobileview', component: MobileviewComponent },
      { path: 'menu', component: MenuComponent },
      { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
      { path: 'booking', component: BookingComponent },
      { path: 'margin', component: MarginComponent, canActivate: [AuthGuard] },
      { path: 'update-kyc', component: ProprietorkycComponent },
      { path: 'kyc_details', component: KycDetailsComponent, canActivate: [AuthGuard] },
      { path: 'rate-alert', component: RatealertComponent, canActivate: [AuthGuard] },
      { path: 'chart', component: ChartComponent, canActivate: [AuthGuard] },
      { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
      { path: 'aboutus', component: AboutusComponent },
      { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },
      { path: 'setTimings', component: SetBusinessTimingsComponent, canActivate: [AuthGuard] },


    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

