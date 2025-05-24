import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  showForm: any;
  isLogin!: string | null;
  userLog: any;
  constructor(private toast: NgToastService, private auth: AuthService,private router: Router) {}
  toggleForm(): void {
    this.showForm = !this.showForm;
  }
  ngOnInit(): void {
    this.userDetails()
  }
  deleteUser(){
    
    Swal.fire({
      title: 'Delete Account',
      text: 'Are you sure you want to delete accout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#073434',
      cancelButtonColor: '#eb4034',
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'swal2-popup',
        title: 'swal2-title',
        confirmButton: 'swal2-confirm',
        cancelButton: 'swal2-cancel'
      }
    }).then((result: any) => {
      if (result.isConfirmed) {
        let userData={};
        this.auth.deleteUser(userData).subscribe(
          (res: any) => {
            localStorage.removeItem('user-token-goldBharatFirst');
            this.toast.success({
              detail: 'Success!',
              summary: 'Account Deleted Successfully!',
            });
            this.auth.setLoginStatus(false);
            this.router.navigate(['/mobile/mobileview']);
          },
          (error) => {
            this.toast.error({
              detail: 'Error!',
              summary: 'Account Deletion Failed!',
            });
          }
        );
        
      }
    });
  }
  userDetails(){
    let log: any = localStorage.getItem('user-token-goldBharatFirst');
    this.isLogin = JSON.parse(log);
      this.auth.userDetailGet().subscribe((res: any) => {
        this.userLog = res;
      });
  }
  logOut() {
    Swal.fire({
      title: 'Logout',
      text: 'Are you sure you want to Logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#073434',
      cancelButtonColor: '#eb4034',
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'swal2-popup',
        title: 'swal2-title',
        confirmButton: 'swal2-confirm',
        cancelButton: 'swal2-cancel'
      }
    }).then((result: any) => {
      if (result.isConfirmed) {
        localStorage.removeItem('user-token-goldBharatFirst');
        localStorage.removeItem('timings')
        localStorage.removeItem('authorization token')
        localStorage.removeItem('lastSavedDate')
        localStorage.removeItem('userData')
        this.toast.success({
          detail: 'Success!',
          summary: 'Logout Successfully!',
        });
        this.auth.setLoginStatus(false);
        this.auth.logout();
        this.router.navigate(['/mobile/mobileview']);
      }
    });
  }

  showUserDetails: boolean = false;

  toggleUserDetails(event: Event) {
      event.stopPropagation(); // Prevent event from bubbling up
      this.showUserDetails = !this.showUserDetails;
  }

  // Add click outside listener
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
      const dropdown = document.querySelector('.user-dropdown');
      if (dropdown && !dropdown.contains(event.target as Node)) {
          this.showUserDetails = false;
      }
  }
}
