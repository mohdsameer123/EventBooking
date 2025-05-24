import { Component } from '@angular/core';
import { HomeService } from '../services/home.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-kyc-details',
  templateUrl: './kyc-details.component.html',
  styleUrls: ['./kyc-details.component.scss']
})
export class KycDetailsComponent {
  userKycDetails: any;
  constructor(private home: HomeService, private location: Location) { }
  ngOnInit(): void {
    this.kycGet();
  }
  goBack() {
    this.location.back();
  }
  // kycGet() {
  //   this.home.getUserKyc().subscribe((res: any) => {
  //     this.userKycDetails = res
  //   })
  // }


  kycGet(): void {
    this.home.getUserKyc().subscribe({
      next: (res: any) => {
        this.userKycDetails = res;
      },
      error: (err) => {
        console.error('Error fetching KYC data', err);
      }
    });
  }
}
