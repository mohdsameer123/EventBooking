// src/app/headerpage/headerpage.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { HomeService } from '../services/home.service';
import { Subscription, interval } from 'rxjs';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-headerpage',
  templateUrl: './headerpage.component.html',
  styleUrls: ['./headerpage.component.scss'],
})
export class HeaderpageComponent implements OnInit, OnDestroy {
  showForm: boolean = false;
  isLogin: boolean = false;
  userLog: any = null;
  notLength: any;
  private pollingSubscription!: Subscription;
  headerbackgroundColor!: string;
  loginButtonColor!:string;
  activeColor!:string;
  activeBorderColor!:string;
  hoverColor!:string;
  logo:any;
  onClickActiveColor: any;

  constructor(
    private toast: NgToastService,
    private auth: AuthService,
    private home: HomeService,
    private configService: ConfigService
  ) {}

  ngOnInit(): void {
    const userToken = localStorage.getItem('user-token-goldBharatFirst');
    this.isLogin = userToken !== null;
    if (this.isLogin) {
      this.loadUserInfo();
      this.getNotification();
      this.startPolling();
    }

    const config = this.configService.getConfig();
    if (config && config.theme && config.theme.headerBackgroundColor && config.theme.loginButtonColor && config.theme.activeColor && config.theme.activeBorderColor && config.theme.hoverColor  &&  config.images && config.images.logo) {
      this.headerbackgroundColor = config.theme.headerBackgroundColor;
      this.loginButtonColor= config.theme.loginButtonColor;
      this.activeColor=config.theme.activeColor;
      this.activeBorderColor = config.theme.activeBorderColor;
      this.hoverColor = config.theme.hoverColor;
      this.onClickActiveColor = config.theme;
      this.logo = config.images.logo;
      console.log("image", this.logo);

    } else {
      this.headerbackgroundColor = '#192259'; // Default color if config is not available
      this.loginButtonColor = '#e1b737';
      // this.logo = 'assets/logo.png'// Fallback to an empty array if no images are provided
    }
  }












  ngOnDestroy(): void {
    this.stopPolling();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  private loadUserInfo(): void {
    this.auth.userDetailGet().subscribe(
      (res: any) => {
        this.userLog = res;
        console.log(this.userLog)
        localStorage.setItem("userData", JSON.stringify(this.userLog))
      },
      (error: any) => {
        console.error('Error fetching user details:', error);
      }
    );
  }

  private getNotification(): void {
    this.home.getNotification().subscribe((res: any) => {
      this.notLength = res.unreadLength;
    });
  }

  private startPolling(): void {
    this.pollingSubscription = interval(2000).subscribe(() => {
      this.getNotification();
    });
  }

  private stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  logOut(): void {
    Swal.fire({
      title: 'Logout',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#073434',
      cancelButtonColor: '#eb4034',
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('user-token-goldBharatFirst');
        this.toast.success({
          detail: 'Success!',
          summary: 'Logged out successfully!',
        });
        this.stopPolling();
        window.location.reload();
      }
    });
  }
}
