import { Component, OnInit } from '@angular/core';
import { HomeService } from '../services/home.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';

interface TimingData {
  isClosed: boolean;
  openingTime: string;
  closingTime: string;
}

@Component({
  selector: 'app-set-business-timings',
  templateUrl: './set-business-timings.component.html',
  styleUrls: ['./set-business-timings.component.scss'],
})
export class SetBusinessTimingsComponent {
  daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  weekendDays = ['Saturday', 'Sunday'];

  globalSetting: TimingData = {
    isClosed: false,
    openingTime: '09:30',
    closingTime: '23:30',
  };

  timings: { [key: string]: TimingData } = {};
  mydata: any[] = [];
  // filteredDistributors: any[] = [];
  selectedDistributor: any = '';
  user_id: any;
  UserData: any;
  // searchText: string = '';

  constructor(
    private homeService: HomeService,
    private toaster: NgToastService,
    private route: Router
  ) {}

  ngOnInit() {
    // Check if the last saved date is stored in localStorage
    const lastSavedDate = localStorage.getItem('lastSavedDate');
    const currentDate = new Date().toDateString();

    if (lastSavedDate !== currentDate) {
        this.resetTimingsToDefault();
        localStorage.setItem('lastSavedDate', currentDate);
    } else {
        const savedTimings = localStorage.getItem('timings');
        if (savedTimings) {
            this.timings = JSON.parse(savedTimings);
        }
    }

    this.daysOfWeek.forEach((day) => {
        if (!this.timings[day]) {
            this.timings[day] = {
                isClosed: this.weekendDays.includes(day),
                openingTime: '09:30',
                closingTime: '23:30',
            };
        }

        // Force weekends to always be closed
        if (this.weekendDays.includes(day)) {
            this.timings[day].isClosed = true;
        }
    });

    const data: any = localStorage.getItem('userData');
    this.UserData = JSON.parse(data);
    console.log(this.UserData);
}

// New method to reset timings to default
resetTimingsToDefault() {
    this.daysOfWeek.forEach((day) => {
        this.timings[day] = {
            isClosed: this.weekendDays.includes(day), // Will be true for Saturday and Sunday
            openingTime: '09:30',
            closingTime: '23:30',
        };
    });
}


applyToAllDays() {
    this.daysOfWeek.forEach((day) => {
        if (this.weekendDays.includes(day)) {
            // Force weekends to be closed
            this.timings[day] = {
                isClosed: true,
                openingTime: '09:30',
                closingTime: '23:30',
            };
        } else {
            // Apply global settings to weekdays only
            this.timings[day] = {
                isClosed: this.globalSetting.isClosed,
                openingTime: this.globalSetting.openingTime,
                closingTime: this.globalSetting.closingTime,
            };
        }
    });
}


  updateStatus(value: boolean, day: string) {
    this.timings[day].isClosed = value;
  }

  saveTimings() {
    // Collect error messages
    const errorMessages: string[] = [];

    // Validate timings before saving
    for (const day of this.daysOfWeek) {
        const openingTime = this.timings[day].openingTime;
        const closingTime = this.timings[day].closingTime;

        // Check for opening time validity
        if (!this.isTimeValid(openingTime)) {
            errorMessages.push(`Opening time for ${day}`);
        }

        // Check for closing time validity
        if (!this.isTimeValid(closingTime)) {
            errorMessages.push(`Closing time for ${day}`);
        }
    }

    // If there are any error messages, display them and exit
    if (errorMessages.length > 0) {
        // Create a unique set of days for the error message
        const uniqueDays = new Set<string>();
        errorMessages.forEach(msg => {
            const dayMatch = msg.match(/for (.+)/);
            if (dayMatch) {
                uniqueDays.add(dayMatch[1]);
            }
        });

        // Create a single error message
        const daysList = Array.from(uniqueDays).join(', ');
        const summaryMessage = `Invalid timings for: ${daysList}. Must be between 09:30 AM and 11:30 PM.`;

        this.toaster.error({
            detail: 'Error',
            summary: summaryMessage, // Display the combined message
        });
        return; // Exit the function if there are errors
    }

    // Proceed with saving timings if all are valid
    const weekTimings = this.daysOfWeek.map((day) => {
        let openingTime12hr = this.convertTo12HourFormat(
            this.timings[day].openingTime
        );
        let closingTime12hr = this.convertTo12HourFormat(
            this.timings[day].closingTime
        );

        // If the day is closed, only send the isClosed property
        if (this.timings[day].isClosed) {
            return {
                day: day,
                isClosed: true, // Only send isClosed as true
            };
        } else {
            // If the day is open, send all properties with 12-hour formatted time
            return {
                day: day,
                isClosed: false,
                openTime: openingTime12hr,
                closeTime: closingTime12hr,
            };
        }
    });

    const userId = String(this.UserData.id);
    localStorage.setItem('timings', JSON.stringify(this.timings));

    // Create the data object to send to the API
    this.homeService.seTimings(userId, weekTimings).subscribe(
        (res) => {
            console.log('Data sent to API:', userId, weekTimings);
            console.log('API Response:', res);
            // Handle success response
            this.toaster.success({
                detail: 'Success',
                summary: 'Timings setting is done successfully',
            });
            if (window.innerWidth <= 768) {
                this.route.navigate(['/mobile/mobileview']); // Navigate to a mobile-specific component
            } else {
                this.route.navigate(['/home']); // Navigate to default home
            }


            window.scrollTo(0, 0);
            
        },
        (error) => {
            console.error('Error occurred while saving timings:', error);
            // Handle error response
            this.toaster.error({
                detail: 'Error',
                summary: 'Timings have not been set successfully',
            });
        }
    );
}

  convertTo12HourFormat(time: string): string {
    const [hours, minutes] = time.split(':').map((num) => parseInt(num, 10));

    // Determine AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';

    // Convert 24-hour time to 12-hour time
    const hours12 = hours % 12 || 12; // If hours == 0, it should show 12 (midnight)

    // Format the time in hh:mm AM/PM format
    return `${this.padZero(hours12)}:${this.padZero(minutes)} ${period}`;
  }

  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  isTimeValid(time: string): boolean {
    const [hours, minutes] = time.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes;
    const startTime = 9 * 60 + 30; // 09:30 AM in minutes
    const endTime = 23 * 60 + 30; // 11:30 PM in minutes

    return timeInMinutes >= startTime && timeInMinutes <= endTime;
}
}
