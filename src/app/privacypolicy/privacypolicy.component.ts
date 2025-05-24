import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ConfigService } from '../services/config.service';
import { Meta, Title } from '@angular/platform-browser';
@Component({
  selector: 'app-privacypolicy',
  templateUrl: './privacypolicy.component.html',
  styleUrls: ['./privacypolicy.component.scss']
})
export class PrivacypolicyComponent {
policy: any;
constructor(private router:Router, private configService:ConfigService, private meta: Meta,
  private titleService: Title ){
}
ngOnInit():void{
  // Set the title
  this.titleService.setTitle('Privacy Policy | A Guide to Secure Gold Transactions | Goldbharat');

  // Set meta tags for description and keywords
  this.meta.updateTag({ name: 'description', content: 'Explore Gold Bharats policy for secure gold transactions. Learn how we prioritize your safety, transparency, and privacy at every step of your investment journey' });
  this.meta.updateTag({ name: 'keywords', content: 'gold purchase in bulk, buy physical gold' });

  this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      window.scrollTo(0, 0); // Scrolls to the top of the page
    }
  });

  const config = this.configService.getConfig();
  if (config && config.policy  ) {
    this.policy = config.policy;

  }



}
}
