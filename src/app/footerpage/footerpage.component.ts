import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-footerpage',
  templateUrl: './footerpage.component.html',
  styleUrls: ['./footerpage.component.scss']
})
export class FooterpageComponent implements OnInit{
  backgroundColor!: string;
  quickLinks: any[] = [];
  contact: any;
  companyDetails: any;
  downloadLinks: any;
  companyname: any;
  socialLinks: any;
  currentYear: number;
  showAddresses: any;

  constructor(private configService: ConfigService) {
    this.currentYear = this.getCurrentYear();
  }
  ngOnInit(): void {
    const config = this.configService.getConfig();
    if (config && config.theme && config.theme.footerBackgroundColor) {
      this.backgroundColor = config.theme.footerBackgroundColor;
    } else {
      this.backgroundColor = '#192259'; // Default color if config is not available
    }

    if (config && config.footer) {
      this.quickLinks = config.footer.quickLinks;
      this.contact = config.footer.contact;
      this.companyDetails = config.footer.companyDetails;
      this.downloadLinks = config.footer.downloadLinks;
      this.socialLinks = config.footer.socialLinks;
      this.showAddresses = config.footer.companyDetails.showAddressesOfDistrubutors;
    }


  }
  getCurrentYear(): number {
    return new Date().getFullYear();
  }



}
