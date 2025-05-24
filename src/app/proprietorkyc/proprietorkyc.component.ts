import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HomeService } from '../services/home.service';
import { NgToastService } from 'ng-angular-popup';
import { PreviewUrls } from '../preview-urls';

@Component({
  selector: 'app-proprietorkyc',
  templateUrl: './proprietorkyc.component.html',
  styleUrls: ['./proprietorkyc.component.scss'],
})
export class ProprietorkycComponent {
  propriotorForm!: FormGroup;
  otherForm!: FormGroup;
  pvtForm!: FormGroup;
  isProprietor: boolean = true;
  selectedFile: any;
  selectedFileGST: any;
  isSubmit: boolean = false;
  isPvt: boolean = false;
  isLpp: boolean=false;
  userKycDetails: any;
  //desable form after click on url
  kycGet() {
    this.home.getUserKyc().subscribe((res: any) => {
      this.userKycDetails = res
    })
  }
  //end
  constructor(private fb: FormBuilder, private home: HomeService, private toast: NgToastService) {
    this.propriotorForm = this.fb.group({
      business_type: ['Proprietor'],
      proprietor_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+(?:[- s][a-zA-Z]+)*$')]],
      proprietor_pan: ['', [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]],
      proprietor_gst: ['', [Validators.required, Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$')]],
      bank_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+(?:[- s][a-zA-Z]+)*$')]],
      account_number: ['', [Validators.required, Validators.pattern('^[0-9]{9,18}$')]],
      ifsc_code: ['', [Validators.required, Validators.pattern('^[A-Z]{4}0[A-Z0-9]{6}$')]],
      account_holder_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+(?:[- s][a-zA-Z]+)*$')]],
      proprietor_pan_image: ['', [Validators.required]],
      proprietor_gst_image: ['', [Validators.required]],
    });

    this.otherForm = this.fb.group({
      business_type: [''],
      director_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+(?:[- s][a-zA-Z]+)*$')]],
      director_mobile: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      director_aadhar: ['', [Validators.required, Validators.pattern('^[0-9]{12}$')]],
      director_pan: ['', [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]],
      director_gst: ['', [Validators.required, Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$')]],
      director_cin: ['', [Validators.required]],
      bank_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+(?:[- s][a-zA-Z]+)*$')]],
      account_number: ['', [Validators.required, Validators.pattern('^[0-9]{9,18}$')]],
      ifsc_code: ['', [Validators.required, Validators.pattern('^[A-Z]{4}0[A-Z0-9]{6}$')]],
      account_holder_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+(?:[- s][a-zA-Z]+)*$')]],
      director_aadhar_front_image: ['', [Validators.required]],
      director_aadhar_back_image: ['', [Validators.required]],
      cin_number_image: ['', [Validators.required]],
      profile_picture: ['', [Validators.required]],
      director_pan_image: ['', [Validators.required]],
      director_gst_image: ['', [Validators.required]],
    });
    this.pvtForm = this.fb.group({
      business_type: [''],
      director_nameone: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+(?:[- s][a-zA-Z]+)*$')]],
      director_mobile: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      director_aadharone: ['', [Validators.required, Validators.pattern('^[0-9]{12}$')]],
      director_panone: ['', [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]],
      director_gst: ['', [Validators.required, Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$')]],
      director_cin: ['', [Validators.required]],
      bank_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+(?:[- s][a-zA-Z]+)*$')]],
      account_number: ['', [Validators.required, Validators.pattern('^[0-9]{9,18}$')]],
      ifsc_code: ['', [Validators.required, Validators.pattern('^[A-Z]{4}0[A-Z0-9]{6}$')]],
      account_holder_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+(?:[- s][a-zA-Z]+)*$')]],
      director_aadhar_front_imageone: ['', [Validators.required]],
      director_aadhar_back_imageone: ['', [Validators.required]],
      cin_number_image: ['', [Validators.required]],
      profile_picture: ['', [Validators.required]],
      director_pan_imageone: ['', [Validators.required]],
      director_gst_image: ['', [Validators.required]],
      // director Two
      director_nametwo: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+(?:[- s][a-zA-Z]+)*$')]],
      // director_aadhartwo: ['', [Validators.required, Validators.pattern('^[0-9]{12}$')]],
      // director_aadhar_front_imagetwo: ['', [Validators.required]],
      // director_aadhar_back_imagetwo: ['', [Validators.required]],
      // director_pantwo: ['', [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]],
      // director_pan_imagetwo: ['', [Validators.required]],

    });
  }
  previewUrls: PreviewUrls = {};
menuKyc=["Proprietor","LLP","Pvt LTD","LTD"];
  onFileSelected(event: any, imageKey: string, previewUrlKey: string) {
    this.selectedFile = event.target.files[0];
    const formData = new FormData();
    formData.append(imageKey, this.selectedFile);
    this.home.imgUpload(formData).subscribe((res: any) => {
      this.otherForm.get(imageKey)?.setValue(res[imageKey]);
      // Set the previewUrl dynamically
      this.previewUrls[previewUrlKey] = res[previewUrlKey];
      this.previewImage(previewUrlKey);

    });
  }
  onFileSelectedPro(event: any, imageKey: string, previewUrlKey: string) {
    this.selectedFile = event.target.files[0];
    const formData = new FormData();
    formData.append(imageKey, this.selectedFile);
    this.home.imgUpload(formData).subscribe((res: any) => {
      this.propriotorForm.get(imageKey)?.setValue(res[imageKey]);
      // Set the previewUrl dynamically
      this.previewUrls[previewUrlKey] = res[previewUrlKey];
      this.previewImage(previewUrlKey);

    });
  }
  onFileSelectedPvt(event: any, imageKey: string, previewUrlKey: string) {
    this.selectedFile = event.target.files[0];
    const formData = new FormData();
    formData.append(imageKey, this.selectedFile);
    this.home.imgUpload(formData).subscribe((res: any) => {
      this.pvtForm.get(imageKey)?.setValue(res[imageKey]);
      // Set the previewUrl dynamically
      this.previewUrls[previewUrlKey] = res[previewUrlKey];
      this.previewImage(previewUrlKey);

    });
  }
  previewImage(previewUrlKey: string) {
    if (!this.selectedFile) {
      this.previewUrls[previewUrlKey] = null;
      return;
    }
  
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = () => {
      this.previewUrls[previewUrlKey] = reader.result as string;
    };
  }
  
  
  
  ngOnInit(): void {
    this.kycGet();
   }
  onSubmit() {
    this.home.kycPost(this.propriotorForm.value).subscribe((res: any) => {
      this.toast.success({ detail: 'Success!', summary: res.msg, position: 'topCenter' });
      this.isSubmit = true;
      this.propriotorForm.reset();
    });
  }
  onOtherSubmit() {
    this.home.kycPost(this.otherForm.value).subscribe((res: any) => {
      this.toast.success({ detail: 'Success!', summary: res.msg, position: 'topCenter' });
      this.isSubmit = true;
      this.otherForm.reset();
    });
  }
  onPvtSubmit() {
    this.home.kycPost(this.pvtForm.value).subscribe((res: any) => {
      this.toast.success({ detail: 'Success!', summary: res.msg, position: 'topCenter' });
      this.isSubmit = true;
      this.pvtForm.reset();
    });
  }
  selectType(event: any) {
    if (event.target.value === 'Proprietor') {
      this.pvtForm.reset();
      this.otherForm.reset();
      this.propriotorForm.reset();
      this.isProprietor = true;
      this.isPvt = false;
      this.isLpp = false;
      this.propriotorForm.get('business_type')?.setValue(event.target.value);
    } else if (event.target.value === 'LLP') {
      this.pvtForm.reset();
      this.otherForm.reset();
      this.propriotorForm.reset();
      this.isProprietor = false;
      this.isPvt = false;
      this.isLpp = true;
      this.otherForm.get('business_type')?.setValue(event.target.value);
    }
    else {
      this.pvtForm.reset();
      this.otherForm.reset();
      this.propriotorForm.reset();
      this.isPvt = true;
      this.isProprietor = false;
      this.isLpp = false;
      this.pvtForm.get('business_type')?.setValue(event.target.value);
    }
  }
}
