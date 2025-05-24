import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ConfigService } from '../services/config.service';
import { Meta, Title } from '@angular/platform-browser';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
company: any;
constructor(private router:Router , private configService: ConfigService, private meta: Meta,
  private titleService: Title){}
ngOnInit():void{
  // Set the title
  this.titleService.setTitle('Best Place to Buy Gold And Silver Bars & Coins | Goldbharat');

  // Set meta tags for description and keywords
  this.meta.updateTag({ name: 'description', content: 'Discover the best place to buy gold bars, gold coins, silver bars, and silver Trust us for reliable investment options and competitive prices for all your precious metal needs.' });
  this.meta.updateTag({ name: 'keywords', content: 'best place to buy gold bars, Buy Bulk Gold Safely, Buy Bulk Gold Securely' });

  this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      window.scrollTo(0, 0); // Scrolls to the top of the page
    }
  });
  const config = this.configService.getConfig();
  if (config && config.policy  ) {
    this.company = config.company;

  }
}
}
