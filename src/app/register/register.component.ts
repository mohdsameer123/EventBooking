import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ConfigService } from '../services/config.service';

// Custom validator to prevent future dates
export function noFutureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const selectedDate = new Date(control.value);
    const today = new Date();
    // Check if the selected date is in the future
    if (selectedDate > today) {
      return { futureDate: true };
    }
    return null;
  };
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm!: FormGroup;
  pin: any;
  isPinAvailble: boolean = false;
  pinArea: any;
  isCity: any;
  isState: any;
  isMobile: boolean = false;
  config: any;
  color!: string;
  color_two: any;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService,
    private configService: ConfigService
  ) {
    this.registerForm = this.fb.group({
      type: ['Distributor'],
      businessName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+(?:[- s][a-zA-Z]+)*$')]],
      personName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+(?:[- s][a-zA-Z]+)*$')]],
      businessAddress: ['', [Validators.required]],
      establishedDate: ['', [Validators.required, noFutureDateValidator()]],
      state: [''],
      city: [''],
      pincode: [
        '',
        [
          Validators.required,
          Validators.maxLength(6),
          Validators.minLength(6),
          Validators.pattern('^((\\+91-?)|0)?[0-9]{6}$'),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
      ],
      circle: ['', [Validators.required]],
    });

  }
  ngOnInit(): void {
    this.isMobile = this.auth.isMobile();
    this.configService.loadConfig().subscribe(config => {
      this.config = config;
      this.color = this.config.atRegistrationPage?.labelColor;
      this.color_two = this.config.atRegistrationPage?.mainHeading;
    });


  }
  onSubmit() {
    this.auth.registerUser(this.registerForm.value).subscribe(
      (res: any) => {
        this.registerForm.reset();
        this.router.navigate(['/login']);
        this.toast.success({ detail: 'Success!', summary: res.msg, position: 'topCenter' });
      },
      (err) => {
        this.toast.error({ detail: 'Oops!', summary: err.error.msg, position: 'topCenter' });
      }
    );
  }
  getArea() {
    if (this.pin.length == 6) {
      this.auth.pinCodeArea(this.pin).subscribe((res: any) => {
        if (res.responseData.PostOffice == null || res.responseData.PostOffice == undefined || res.responseData.PostOffice == 0) {
          this.toast.error({ detail: 'Oops!', summary: 'You entered pincode is incorrect!', position: 'topCenter' });
          this.isPinAvailble = false;
        }
        else {
          this.isPinAvailble = true;
          this.pinArea = res.responseData?.PostOffice;
          this.isCity = res.responseData?.PostOffice[0]?.Circle;
          this.isState = res.responseData?.PostOffice[0]?.State;
        }

      });
    } else {
    }
  }
}
