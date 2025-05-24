import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router,private toast: NgToastService, private auth: AuthService,) {}
  isMobile: boolean = false;

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const token = localStorage.getItem('user-token-goldBharatFirst');
    if (!!token) {
      return true; // User is logged in
    } else {
      this.toast.error({ detail: 'Authentication Required', summary:'Login/Register to the Application' , position: 'topCenter' })
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000); // 1 second delay to ensure toast is visible
      this.isMobile = this.auth.isMobile();

      if(this.isMobile){
        this.router.navigate(['/mobile/mobileview']); // Assuming '/dashboard' is the route for the signed-in page

      }
      else{
        this.router.navigate(['/']); // Assuming '/dashboard' is the route for the signed-in page

      }
      return false; // User is not logged in
    }
  }
}
