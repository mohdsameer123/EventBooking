import { Component, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/services/auth.service';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-headermobile',
  templateUrl: './headermobile.component.html',
  styleUrls: ['./headermobile.component.scss']
})
export class HeadermobileComponent implements OnInit {
  isLogin: any;
  notLength: any;

  constructor(
    private toast: NgToastService,
    private auth: AuthService,
    private home:HomeService
  ) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    this.auth.loginStatus$.subscribe((isLoggedIn) => {
      this.checkLoginStatus();
    });
  }

  checkLoginStatus() {
    let log: any = localStorage.getItem('user-token-goldBharatFirst');
    this.isLogin = JSON.parse(log);
    if(this.isLogin){
      this.getNotification();
    }
  }
  getNotification(){
    this.home.getNotification().subscribe((res:any)=>{
      this.notLength=res.unreadLength;
      console.log('hNot',res)
    })
  }
}
