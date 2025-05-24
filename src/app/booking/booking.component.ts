import { Component } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Meta, Title } from '@angular/platform-browser';
@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent {
  bookingPage: any;
  bookingPageContent: any;
  url: any;
  constructor(private configService: ConfigService, private meta: Meta,private sanitizer: DomSanitizer,
    private titleService: Title) {

  }

  ngOnInit(): void {
    // Set the title
    this.titleService.setTitle('Booking | Buy Bulk Gold & Silver | Goldbharat');

    // Set meta tags for description and keywords
    this.meta.updateTag({ name: 'description', content: 'Book Gold Bharat now and secure your gold investment with confidence.Enjoy a seamless booking experience and invest in gold, a timeless asset for future growth and security.' });
    this.meta.updateTag({ name: 'keywords', content: 'Buy Bulk Gold Securely, buy physical gold' });

    const config = this.configService.getConfig();
    if (config && config.bookingPage && config.locateUs.url) {
      this.bookingPage = config.bookingPage;
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(config.locateUs.url);
    }
    
  }

}
