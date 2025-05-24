import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  serverEndpoint = environment.apiUrl;
  private loginStatus = new Subject<boolean>();
  loginStatus$ = this.loginStatus.asObservable();

  setLoginStatus(isLoggedIn: boolean) {
    this.loginStatus.next(isLoggedIn);
  }
  constructor(private http: HttpClient) {}
  registerUser(data: any) {
    const endPoint = `auth/register`;
    return this.http.post(this.serverEndpoint + endPoint, data);
  }
  pinCodeArea(pincode: number) {
    const endPoint = `pincode/${pincode}`;
    return this.http.get(this.serverEndpoint + endPoint);
  }
  sendOpt(data: any) {
    const endPoint = `auth/sendotp`;
    return this.http.post(this.serverEndpoint + endPoint, data);
  }
  verifyOtp(data: any) {
    const endPoint = `auth/verifyotp`;
    return this.http.post(this.serverEndpoint + endPoint, data);
  }
  loginUser(data: any) {
    const endPoint = `auth/login`;
    return this.http.post(this.serverEndpoint + endPoint, data);
  }
  userDetailGet() {
    const endPoint = `getProfile`;
    const ttoken: any = localStorage.getItem('user-token-goldBharatFirst');
    const token = JSON.parse(ttoken);
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http.get(this.serverEndpoint + endPoint, { headers: headers });
  }
  isLoggedIn() {
    return !!localStorage.getItem('user-token-goldBharatFirst');
  }
  isMobile(): boolean {
    const userAgent = navigator.userAgent || navigator.vendor;
    return /android|iPad|iPhone|iPod/i.test(userAgent) || window.innerWidth <= 768;
  }
  // deleteUser(data:any){
  //   const endPoint=`userTerminate`
  //   this.http.post(this.serverEndpoint+endPoint,data);
  // }
  deleteUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.serverEndpoint}/userTerminate`, { body: userData });
  }
// userLoginStatus
private isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());
private hasToken(): boolean {
  return !!localStorage.getItem('user-token-goldBharatFirst');
}


// Get the current login status as an observable
public isLoggedInFooter() {
  return this.isLoginSubject.asObservable();
}

// Log in method
public login(token: string): void {
  localStorage.setItem('user-token-goldBharatFirst', token);
  this.isLoginSubject.next(true);
}

// Log out method
public logout(): void {
  localStorage.removeItem('user-token-goldBharatFirst');
  this.isLoginSubject.next(false);
}
}

