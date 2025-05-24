import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ConfigService } from './services/config.service';
import { HomeService } from './services/home.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'project';
  constructor(private meta: Meta, private configService: ConfigService, private authService: HomeService) { }

  ngOnInit(): void {
    // Add a meta tag for description
    this.meta.addTag({ name: 'Gold Bharat', content: 'Tavishi Bullion is part of a diversified three decades old Aztar Group. Est. in 1990, which specializes in Print Media, Tech Application, Insurance Broking, Data Analytics, Ecommerce, Non Tangible Asset Management, Property Underwriting, Corporate Law Advisory and Activations' });

    // Add a meta tag for keywords
    this.meta.addTag({ name: 'Gold Bharat', content: 'Gold Product' });

    this.configService.loadConfig().subscribe(config => {
      if (config && config.company && config.company.globalBackGroundColor) {
        this.applyGlobalStyles(config.company.globalBackGroundColor);
      }
    });
    // auto logout
    this.authService.checkUserStatus().subscribe(
      (response) => {
        console.log('User status is active:', response);
        // window.location.reload();
      },
      (error) => {
        // Handle additional error cases here if needed
        console.log('Error occurred:', error);
      }
    );
  }

  applyGlobalStyles(globalBackGroundColor: string): void {
    document.body.style.backgroundColor = globalBackGroundColor;
  }
}
