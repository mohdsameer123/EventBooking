import { Component } from '@angular/core';
import { HomeService } from '../services/home.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-goldratehistory',
  templateUrl: './goldratehistory.component.html',
  styleUrls: ['./goldratehistory.component.scss']
})
export class GoldratehistoryComponent {
  records: any[] = [];
  page: number = 1; 
  constructor(private goldSilverService: HomeService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {

this.goldHistory();
}


// goldHistory(){

// this.goldSilverService.getMultipleGoldRecords(365).subscribe(
//       data => {
//         this.records = data.randomRecords
//           .filter((record: { carat: number; purity: number; }) => record.carat === 24 && record.purity === 999)
//           .reverse();
//       },
//       error => {
//         console.error('Error fetching gold records:', error);
//       }
//     );
//   }
goldHistory() {
  // Show the loader
  this.spinner.show();

  this.goldSilverService.getMultipleGoldRecords(365).subscribe(
      data => {
          // Hide the loader
          this.spinner.hide();

          this.records = data.randomRecords
              .filter((record: { carat: number; purity: number; }) => record.carat === 24 && record.purity === 999)
              .reverse();
      },
      error => {
          // Hide the loader even if there's an error
          this.spinner.hide();

          console.error('Error fetching gold records:', error);
      }
  );
}

}
