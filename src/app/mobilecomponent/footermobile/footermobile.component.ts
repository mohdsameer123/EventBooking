// footermobile.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-footermobile',
  templateUrl: './footermobile.component.html',
  styleUrls: ['./footermobile.component.scss']
})
export class FootermobileComponent implements OnInit {
  isLogin!: boolean;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isLoggedInFooter().subscribe(isLoggedInFooter => {
      this.isLogin = isLoggedInFooter;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
