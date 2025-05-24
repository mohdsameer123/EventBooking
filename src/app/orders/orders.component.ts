import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from '../services/home.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  orders: any;
  noData: boolean = false;
  UpdateDocForm!: FormGroup;
  selectedFile: File | null = null;
  orderId!: number;
  isTrade: boolean = false;
  deliveryDetails: any;
  otherform!: FormGroup;
  isSelf: boolean = true;
  selectedFileone: File | null = null;
  urlImage: any;
  selectedFile_otherperson: any;
  rejectionReason: any;
  DeliveryStatusDetails: any;
  deliveryDetailsAbove500: any;
  above500Details: any;
  orderIdAbove500: any;
  rejectionReceipt: any;
  constructor(
    private home: HomeService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private toast: NgToastService,
    private auth: AuthService,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) {
    this.UpdateDocForm = this.fb.group({
      transaction_image: ['', [Validators.required]],
      transation_id: [
        '',
        [Validators.required, Validators.pattern(/^.{12,}$/)],
      ],
      order_id: [''],
    });

    this.otherform = this.fb.group({
      order_id: ['', [Validators.required]],
      other_person_name: ['', [Validators.required]],
      other_person_number: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
      other_person_id_card_number: ['', [Validators.required]],
      other_person_doc: ['', [Validators.required]],
    });
  }

  otherPersonFile(event: any) {
    this.selectedFile_otherperson = event.target.files[0];
    if (this.selectedFile_otherperson) {
      const formData = new FormData();
      formData.append('other_person_doc', this.selectedFile_otherperson);
      console.log(
        'image',
        formData.append('other_person_doc', this.selectedFile_otherperson)
      );
      // Log the selected file details
      console.log('Selected file:', this.selectedFile_otherperson);
    }
  }
  onOtherFormSubmit() {
    // Create a new FormData object to hold the entire form data, including the file
    const formData = new FormData();

    // Append the form values
    Object.keys(this.otherform.value).forEach((key) => {
      formData.append(key, this.otherform.get(key)?.value);
    });

    // Append the file (check if the file exists)
    if (this.selectedFile_otherperson) {
      formData.append('other_person_doc', this.selectedFile_otherperson);
    }

    this.home.userNewPersonDetailspost(formData).subscribe(
      (res: any) => {
        this.orderStatusUpdate(this.orderId || this.orderIdAbove500);
        this.loadOrders('BUY');
        this.otherform.reset();
        window.location.reload();

        this.toast.success({
          detail: 'Success',
          summary: res.msg,
          position: 'topCenter',
        });
      },
      (err) => {
        this.toast.error({
          detail: 'Oops!',
          summary: err.error.msg,
          position: 'topCenter',
        });
      }
    );
  }
  resetOtherForm() {
    window.location.reload();
  }

  isUploadDisabled: boolean = false
  onFileSelectedReceipt(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
        // Validate file type
        const validImageTypes = ['image/png', 'image/jpeg'];
        const validImageExtensions = ['.png', '.jpg', '.jpeg'];
        const validVideoTypes = ['video/mp4', 'video/avi', 'video/mkv'];
        const fileExtension = this.selectedFile.name.split('.').pop()?.toLowerCase(); // Get file extension

        // Check if the selected file is a video
        if (validVideoTypes.includes(this.selectedFile.type)) {
            this.isUploadDisabled = true; // Disable the upload button
            this.toast.error({ detail: 'Error', summary: 'Video files are not allowed for upload.', duration: 5000 });
            event.target.value = ''; // Reset the input
            return;
        }

        // Check if the selected file is not a valid image
        if (!validImageTypes.includes(this.selectedFile.type) || 
            !validImageExtensions.includes(`.${fileExtension}`)) {
            this.isUploadDisabled = true; // Disable the upload button
            this.toast.error({ detail: 'Error', summary: 'Please select a valid image file (PNG or JPEG).', duration: 5000 });
            event.target.value = ''; // Reset the input
            return;
        }

        // If a valid image is selected, enable the upload button
        this.isUploadDisabled = false;

        // Proceed with file upload
        const formData = new FormData();
        formData.append('transaction_image', this.selectedFile);

        this.home.imgUpload(formData).subscribe(
            (res: any) => {
                console.log('API Response:', res);
                this.UpdateDocForm.get('transaction_image')?.setValue(res.transaction_image);
            },
            (error: any) => {
                console.error('Upload failed:', error);
                this.toast.error({ detail: 'Upload Error', summary: 'An error occurred while uploading the image. Please try again.', duration: 5000 });
            }
        );
    } else {
        this.isUploadDisabled = true; // Disable the upload button if no file is selected
    }
}
  onGetId(id: number) {
    console.log(id);
    this.UpdateDocForm.get('order_id')?.setValue(id);
    this.orders.forEach((ele: any) => {
      if (ele.id === id) {
        this.rejectionReason = ele.rejection_reason;
        this.rejectionReceipt = ele.transaction_image
      }
    });
  }
  pickUpMsg(id: number) {
    this.home.deliveryMsg(id).subscribe((res: any) => {
      this.deliveryDetails = res.deliveryDetails;
      console.log(this.deliveryDetails);
    });
  }
  onSubmit() {
    this.home.receiptUpdate(this.UpdateDocForm.value).subscribe(
      (res: any) => {
        this.loadOrders('BUY');
        this.UpdateDocForm.reset();
        this.toast.success({
          detail: 'Success',
          summary: res.msg,
          position: 'topCenter',
        });
      },
      (err) => {
        this.toast.error({
          detail: 'Ooops!',
          summary: err.error.msg,
          position: 'topCenter',
        });
      }
    );
  }
  selfConform() {
    this.orderStatusUpdate(this.orderId || this.orderIdAbove500); // Assuming this is synchronous
    this.toast.success({
      detail: 'Success',
      summary: 'Confirmation to pick up the order yourself.',
      position: 'topCenter',
    });

    this.loadOrders('BUY'); // Assuming this is synchronous

    // Delay the page reload to give time for toast notification
    setTimeout(() => {
      window.location.reload();
    }, 1500); // Adjust this delay if needed
  }

  // submitDeliveryBoy(){
  //   this.orderStatusUpdate(this.orderId || this.orderIdAbove500);
  //   this.toast.success({
  //     detail: 'Success',
  //     summary: 'Confirmation to pick up the order yourself.',
  //     position: 'topCenter',
  //   });

  //   this.loadOrders('BUY');
  //   setTimeout(() => {
  //     window.location.reload();
  //   }, 1500);
  // }

  // submitcourier(){
  //   this.orderStatusUpdate(this.orderId || this.orderIdAbove500);
  //   this.toast.success({
  //     detail: 'Success',
  //     summary: 'Confirmation to pick up the order yourself.',
  //     position: 'topCenter',
  //   });

  //   this.loadOrders('BUY');
  //   setTimeout(() => {
  //     window.location.reload();
  //   }, 1500);
  // }

  ngOnInit(): void {
    this.loadOrders('BUY');
  }
  updateBuy(event: any) {
    this.loadOrders(event.target.value);
  }
  loadOrders(orderType: string): void {
    if (orderType != 'BUY') {
      this.isTrade = true;
    } else {
      this.isTrade = false;
    }
    this.home.ordersGet(orderType).subscribe(
      (res: any) => {
        this.orders = res;
        this.noData = !res || res.length === 0; // Set noData flag if no orders or response is empty
      },
      (error) => {}
    );
  }
  orderpicker(event: any) {
    console.log(event.target.value);
    if (event.target.value === 'self') {
      this.isSelf = true;
    } else {
      this.isSelf = false;
    }
  }
  getOrderId(id: number, pro: any) {
    this.orderId = id;
    this.otherform.get('order_id')?.setValue(id);
    this.pickUpMsg(id);
    this.DeliveryStatusDetails = pro;
    console.log(this.DeliveryStatusDetails);
  }
  orderStatusUpdate(id: number) {
    this.home
      .updateOrderStatus({
        order_id: id,
        status: 5,
      })
      .subscribe((res: any) => {});
  }

  getOrderIdAbove500(id: any, pro: any) {
    this.orderIdAbove500 = id;
    this.otherform.get('order_id')?.setValue(id);
    this.pickUpMsg(id);
    this.above500Details = pro;
    this.home.deliveryMsg(id).subscribe((res: any) => {
      this.deliveryDetailsAbove500 = res.deliveryDetails;
      console.log(this.above500Details);
      console.log(this.deliveryDetailsAbove500);
    });
  }

  submitDeliveryBoy() {
    this.home
      .updateOrderStatus({
        order_id: this.orderId || this.orderIdAbove500,
        status: 4, // Set status to 4 for delivery boy
      })
      .subscribe(
        (res: any) => {
          this.toast.success({
            detail: 'Success',
            summary: 'Order dispatched via delivery boy.',
            position: 'topCenter',
          });

          this.loadOrders('BUY');
          setTimeout(() => {
            window.location.reload();
          }, 1500); // Adjust the delay if needed
        },
        (err) => {
          this.toast.error({
            detail: 'Oops!',
            summary: 'Failed to update the order status.',
            position: 'topCenter',
          });
        }
      );
  }

  submitcourier() {
    this.home
      .updateOrderStatus({
        order_id: this.orderId || this.orderIdAbove500,
        status: 4, // Set status to 4 for courier
      })
      .subscribe(
        (res: any) => {
          this.toast.success({
            detail: 'Success',
            summary: 'Order dispatched via courier.',
            position: 'topCenter',
          });

          this.loadOrders('BUY');
          setTimeout(() => {
            window.location.reload();
          }, 1500); // Adjust the delay if needed
        },
        (err) => {
          this.toast.error({
            detail: 'Oops!',
            summary: 'Failed to update the order status.',
            position: 'topCenter',
          });
        }
      );
  }

  isZoomed: boolean = false;

  toggleZoom(): void {
    this.isZoomed = !this.isZoomed;
  }
}
