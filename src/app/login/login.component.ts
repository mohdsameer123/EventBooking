import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { NgOtpInputComponent } from 'ng-otp-input';
import { Router } from '@angular/router';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: FormGroup;
  remainingTime: any;
  otplayout: boolean = false;
  isTimerCompleted!: boolean;
  mylayout: boolean = true;
  loginresponse: any;
  submitted = false;
  token: any;
  userdetails: any;
  isLogin: any;
  baseurl: any;
  resphone: any;
  timer: any;
  isResend: boolean = false;
  isMobile: boolean = false;
  config: any;
  color: any;
  backgroundColor: any;
  cardBackGroundColor: any;

  constructor(private fb: FormBuilder, private auth: AuthService, private toast: NgToastService, private router: Router,private configService: ConfigService) {
    this.loginForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]]
    })
  }
  ngOnInit(): void {
    this.isMobile = this.auth.isMobile();
    this.configService.loadConfig().subscribe(config => {
      this.config = config;
      this.color = this.config.atLoginPage?.loginButtonColor;
      this.backgroundColor = this.config.atLoginPage.loginPageBackgroundColor;
      this.cardBackGroundColor = this.config.atLoginPage.loginPageCardColor;

    });

  }
  backToPage() {
    window.location.reload();

  }
  sendotp() {
    const otpdata = {
      phone: this.resphone
    }
    this.auth.sendOpt(otpdata).subscribe((res: any) => {
      this.toast.success({ detail: 'Success!', summary: 'OTP Sent Successfully' });
      this.startTimer()
      this.otplayout = true;
      this.isTimerCompleted = false;
      this.isResend = false;
      if (this.otpInput) {
        this.otpInput.setValue('');
      }

    },
      err => {
        this.toast.error({ detail: 'Oops!', summary: err.error.msg });

      })
  }

  @ViewChild('otpInput') otpInput: NgOtpInputComponent | undefined;

  //otp verification//
  onOtpChange(code: string) {
    // Trim the code to remove any leading/trailing spaces
    code = code.trim();

    // Remove non-numeric characters
    const numericCode = code.replace(/\D/g, '');

    // Check if the numeric code length is 6
    if (numericCode.length === 6) {
      const optphn = this.resphone;
      const data = {
        phone: optphn,
        code: numericCode, // Use the cleaned numeric code
      };

      // Verify OTP
      // this.spinner.show();
      this.auth.verifyOtp(data).subscribe(
        (res: any) => {
          // localStorage.setItem('user-token-goldBharatFirst', JSON.stringify(this.token));
          localStorage.setItem('user-details-goldBharat', this.userdetails);
          this.toast.success({ detail: 'Success!', summary: 'Login Successfully' });
          this.isMobile = this.auth.isMobile();
          this.auth.login(JSON.stringify(this.token));
          if (this.isMobile) {
            this.router.navigate(['/mobile/mobileview']);
          }
          else {
            this.router.navigate(['/']);

          }
          this.stopTimer();
        },
        (error: any) => {
          this.toast.error({ detail: 'Oops!', summary: error.error.msg });
        }
      );
    }
  }


  //start timer//
  startTimer(): void {
    const duration = 1 * 60; // 2 minutes in seconds
    let seconds = duration;
    this.timer = setInterval(() => {
      const minutes = Math.floor(seconds / 60);
      const secondsDisplay = (seconds % 60).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
      });

      this.remainingTime = `${minutes}:${secondsDisplay}`;
      if (this.remainingTime == '0:00') {
        this.isResend = true;
      }

      if (seconds <= 0) {
        clearInterval(this.timer);
        // this.otplayout = false;
        this.mylayout = true;
      }

      seconds--;
    }, 1000);
  }
  stopTimer(): void {
    clearInterval(this.timer);
    this.mylayout = true;
  }
  onSubmit() {
    this.auth.loginUser(this.loginForm.value).subscribe((res: any) => {
      this.resphone = this.loginForm.get('phone')!.value;
      this.sendotp()
      this.loginresponse = res.data;
      this.token = res.data.token;
      this.userdetails = this.loginresponse.olduser;
      this.submitted = false;
      this.loginForm.reset();
    }, err => {
      this.toast.error({ detail: 'Oops!', summary: err.error.msg, position: 'topCenter' });
    })
  }
}
