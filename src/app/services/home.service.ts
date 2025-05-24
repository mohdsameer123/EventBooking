import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { catchError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  serverEndpoint = `${environment.apiUrl}`;

  constructor(private http: HttpClient,private router:Router) { }
  getLivePrice() {
    const endPoint = `/liverate`;
    return this.http.get(this.serverEndpoint + endPoint);
  }
  bookGoldAndSilver(data: any) {
    const endPoint = `booking`;
    return this.http.post(this.serverEndpoint + endPoint, data);
  }
  buyGoldAnsSilver(data: any) {
    const endPoint = `order`;
    return this.http.post(this.serverEndpoint + endPoint, data);
  }
  kycPost(data: any) {
    const endPoint = `KYCupdate`;
    return this.http.post(this.serverEndpoint + endPoint, data);
  }
  imgUpload(data: any) {
    const endPoint = `multipleImageUpload`;
    return this.http.post(this.serverEndpoint + endPoint, data);
  }
  aboutUs() {
    const endPoint = `aboutus`;
    return this.http.get(this.serverEndpoint + endPoint);
  }
  ordersGet(type: string) {
    const endPoint = `getMyOrders/${type}`;
    return this.http.get(this.serverEndpoint + endPoint);
  }
  receiptUpdate(data: any) {
    const endPoint = `upload-transaction`;
    return this.http.post(this.serverEndpoint + endPoint, data);
  }
  getGoldLimit() {
    const endPoint = `auth/getMaxLimit`;
    return this.http.get(this.serverEndpoint + endPoint);
  }
  getSilverLimit() {
    const endPoint = `auth/getSilverMaxLimit`;
    return this.http.get(this.serverEndpoint + endPoint);
  }
  postAlertrate(data: any) {
    const endPoint = `alert`;
    return this.http.post(this.serverEndpoint + endPoint, data);
  }
  getMargin() {
    const endPoint = `getMargins`;
    return this.http.get(this.serverEndpoint + endPoint)
  }
  silverGetMargin() {
    const endPoint = `getSilverMargins`;
    return this.http.get(this.serverEndpoint + endPoint)
  }
  chartData(data: any) {
    const endPoint = `recordsByTime`;
    return this.http.post(this.serverEndpoint + endPoint, data);
  }
  updateOrderStatus(data: any) {
    const endPoint = `changeOrderStatus`;
    return this.http.post(this.serverEndpoint + endPoint, data);
  }
  getUserKyc(): Observable<any>{
    const endPoint=`getKyc`;
    return this.http.get(this.serverEndpoint+endPoint);
  }
  deliveryMsg(id: number) {
    const endPoint = `getDeliveryDetails/${id}`;
    return this.http.get(this.serverEndpoint + endPoint);
  }
  userNewPersonDetailspost(data: any) {
    const endPoint = `deliveryOtherPerson`;
    return this.http.post(this.serverEndpoint + endPoint, data);
  }
  getNotification(): Observable<any> {
    const endPoint = `notification`;
    return this.http.get(this.serverEndpoint + endPoint);
  }
  notificationRead() {
    const endPoint = `notifications/markAsRead`;
    return this.http.post(this.serverEndpoint + endPoint, {})
  }
  singleImgUpload(data: any) {
    const endPoint = `imageupload`;
    return this.http.post(this.serverEndpoint + endPoint, data);
  }


  public apiUrlForLivePriceFromDb = 'https://liverates-api.goldcentral.in/api/liveRateDB';



  getInitialRates(): Observable<any> {
    return this.http.get<any>(this.apiUrlForLivePriceFromDb);
  }
  public apiUrlForLivePriceForHistory = 'https://liverates-api.goldcentral.in/api/'

  getMultipleGoldRecords(days: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlForLivePriceForHistory}/getMultipleGoldRecord/${days}`);
  }
  // Function to check user active status
  checkUserStatus(): Observable<any> {
    const token = localStorage.getItem('user-token-goldBharatFirst');  // Get the token from localStorage

 

    if (!token) {
      return new Observable((observer) => {
        observer.error('Token not found');
      });
    }

    // Decode the token to get userId
    const decodedToken = jwtDecode<any>(token);
    const userId = decodedToken.id;  // Assuming the 'id' is part of the token payload

    // Interceptor will handle headers
    return this.http.get<any>(`${this.serverEndpoint}/check-user-status/${userId}`).pipe(
      catchError((error) => {
        if (error.status === 403) {
          // If 403 error occurs, logout the user
          this.logout();
        }
        throw error;
      })
    );

  }
  // Function to logout user
  logout() {
    localStorage.removeItem('user-token-goldBharatFirs');  // Remove token from localStorage
    this.router.navigate(['/login']);  // Redirect to login page (or any other page)
  }

  getTimings(userId: number): Observable<any> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<any>(`${this.serverEndpoint}timings/check-visibility`, { params });
  }

  seTimings(userId : string, weekTimings : any): Observable<any> {
    const endpoint =`settimings`
    return this.http.post<any>(this.serverEndpoint+endpoint,{userId,weekTimings})
     }

}
