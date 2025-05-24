import { Component } from '@angular/core';
import { HomeService } from '../services/home.service';
import { NavigationEnd, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss']
})
export class AboutusComponent {
  about: any;
  content_1:any;
  content_2:any;
  content_3:any;
  content_4:any;
  content_5:any;
  content_6:any;
  content_7:any;
  content_8:any;
  heading_1:any;
  heading_2:any;
  heading_3:any;
  heading_4:any;
  heading_5:any;
  constructor(
    private home: HomeService,
    private router: Router,
    private meta: Meta,
    private titleService: Title) { }
  ngOnInit(): void {
    // Set the title
    this.titleService.setTitle('About Us | Buy Gold & Silver in Bulk | Gold Price Today | Goldbharat');

    // Set meta tags for description and keywords
    this.meta.updateTag({ name: 'description', content: 'Learn about our trusted gold services. Buy gold & silver in bulk at competitive prices and stay updated with the latest gold & silver price today, your reliable partner in gold investment.' });
    this.meta.updateTag({ name: 'keywords', content: 'buy gold in bulk, gold price today, buy gold & silver in bulk at best price' });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0); // Scrolls to the top of the page
      }
    });
    this.getAboutus();
  }
  getAboutus() {
    this.home.aboutUs().subscribe((res: any) => {
      this.about = res.content;
      this.content_1 = res.content_1;
      this.content_2 = res.content_2;
      this.content_3 = res.content_3;
      this.content_4 = res.content_4;
      this.content_5 = res.content_5;
      this.content_6 = res.content_6;
      this.content_7 = res.content_7;
      this.content_8 = res.content_8;
      this.heading_1 = res.heading_1;
      this.heading_2 = res.heading_2;
      this.heading_3 = res.heading_3;
      this.heading_4 = res.heading_4;
      this.heading_5 = res.heading_5;
    })
  }
}
