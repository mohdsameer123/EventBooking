import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ConfigService } from '../services/config.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Meta, Title } from '@angular/platform-browser';
@Component({
  selector: 'app-loacteus',
  templateUrl: './loacteus.component.html',
  styleUrls: ['./loacteus.component.scss']
})
export class LoacteusComponent {
phoneNumbers: any;
  email: any;
  address: any;
  url:any;
  backGroundColor: any;
constructor(private router:Router, private configService:ConfigService,private sanitizer: DomSanitizer, private meta: Meta,private titleService: Title ){}
ngOnInit():void{
  // Set the title
  this.titleService.setTitle('Contact Us | Bulk Gold & Silver-For Sale | Goldbharat');

  // Set meta tags for description and keywords
  this.meta.updateTag({ name: 'description', content: 'Contact Gold Bharat for inquiries about gold and silver investments. Our team is here to assist you with your precious metal needs and investment queries.' });
  this.meta.updateTag({ name: 'keywords', content: 'contact us goldbharat, Bulk Gold for Sale, Buy Bulk Gold Coins' });

  this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      window.scrollTo(0, 0); // Scrolls to the top of the page
    }
  });

  const config = this.configService.getConfig();
  if (config && config.locateUs && config.locateUs.email && config.locateUs.address && config.locateUs.url) {
    this.phoneNumbers = config.locateUs.phoneNumbers;
    this.backGroundColor= config.locateUs
    this.email= config.locateUs.email;
    this.address=config.locateUs.address;
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(config.locateUs.url);
     console.log("url", this.url);

  }



}


}
