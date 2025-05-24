import { Component } from '@angular/core';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  allnoti: any;
  page: number = 1; 
  noData: boolean = true;
  constructor(private home: HomeService) { }
  ngOnInit(): void {
    this.readNoti(1);
    this.getNotification();
  }
  getNotification() {
    this.home.getNotification().subscribe((res: any) => {
      this.allnoti = res.readAndUnreadNotifications;
      console.log('not', res);
      if (this.allnoti && this.allnoti.length > 0) {
        this.noData = false; // Data exists
      } else {
        this.noData = true; // No data
      }
    })
  }
  readNoti(id: any) {
    this.home.notificationRead().subscribe((res: any) => {
      console.log('read', res)
    })
  }
  // Method to display the correct label based on conditions
  getDisplayValue(not: any): string {
    if (!not?.order_id) { // If order_id is empty
      if (not?.status === 'Rate Matched' || not?.status === 'Price Decreased') {
        return 'Rate Alert';
      } else if (
        not?.status === 'kyc Approved' ||
        not?.status === 'kyc Pending' ||
        not?.status === 'kyc Rejected'
      ) {
        return 'KYC';
      }
    }

    // If order_id is present, return the order_id
    return not?.order_id || '';
  }
}
