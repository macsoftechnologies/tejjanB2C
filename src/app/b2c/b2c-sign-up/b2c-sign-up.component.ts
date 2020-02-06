import { Component, OnInit } from "@angular/core";

import { AlrajhiumrahService } from "../../services/alrajhiumrah.service";
import { Router } from '@angular/router';
import { BroadcastserviceService } from 'src/app/services/broadcastservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { B2bSignInComponent } from 'src/app/b2b/b2b-sign-in/b2b-sign-in.component';
import Swal from 'sweetalert2';

@Component({
  selector: "app-b2c-sign-up",
  templateUrl: "./b2c-sign-up.component.html",
  styleUrls: ["./b2c-sign-up.component.scss"]
})
export class B2cSignUpComponent implements OnInit {
  signupForm: FormGroup;
  countries: any;
  signUpValidationFlag : boolean;
  registrationResp: any;
  user: string;
  modal: NgbModalRef;
  modals: NgbModalRef;

  constructor(private tejaanServices: AlrajhiumrahService,
    private formBuilder: FormBuilder,
    private router:Router,
    private broadcastservice: BroadcastserviceService,
    private activeModal: NgbModal,
    private modalService: NgbModal,
    ) {
     
    }

  ngOnInit() {
    this.broadcastservice.stepperValue.emit(0);
    console.log("sinup constructor");
    this.loadSignUpForm();
    this.broadcastservice.customStepper.emit(false);
    this.getCountries();

  }

  //  ****** Get countries List *****

  public getCountries(): void {
    this.tejaanServices.getCountyList().subscribe(data => {
      this.countries = data;
      // console.log("countries List", JSON.stringify(this.countries));
    });
  }

  resolved(captchaResponse: string) {
    // console.log(`Resolved captcha with response: ${captchaResponse}`);
  }

  public loadSignUpForm(): void {
    this.signupForm = this.formBuilder.group({
      email: ["" , Validators.required],
      userName: ["" , Validators.required],
      country: ["" , Validators.required],
      phoneNumber: ["" , Validators.required],
      password: ["" , Validators.required],
      confirmPasswd: ["" , Validators.required]
    });
  }
  public navigateToSinin():void{
    this.signUpValidationFlag = this.signupForm.valid ? false : true ;
    if(!this.signUpValidationFlag) {
      let signUpObj = {
        type: "B2C",
        email: this.signupForm.value.email,
        userName: this.signupForm.value.userName,
        country: this.signupForm.value.country.countryName,
        phoneNumber: this.signupForm.value.phoneNumber,
        password: this.signupForm.value.password
      }

      this.tejaanServices.registration(signUpObj).subscribe(data => {
        this.registrationResp = data;
        console.log("registrationResp" , this.registrationResp);
        if(this.registrationResp.body.status === 200) { 
          // localStorage.setItem('userData', JSON.stringify(signUpObj));
          this.broadcastservice.showHideLogin.emit(false);
          this.activeModal.dismissAll();   
          if(location.pathname === "/b2c/signup"){
            this.router.navigateByUrl("b2c/signin");
          }else{
            this.modal = this.modalService.open(B2bSignInComponent);
          }

          // this.router.navigateByUrl("b2b/signin");
          // this.user = localStorage.getItem('userData');
          // if(this.user == null && this.user == undefined) {
          //   this.broadcastservice.showHideLogin.emit(false);
          // }
          // else { 
          //   this.broadcastservice.showHideLogin.emit(true);
          // }
        }else{
          this.broadcastservice.showHideLogin.emit(true);
          Swal.fire({
            // title: 'Sweet!',
            text: this.registrationResp.body.message,
          });
        }
      });
    }
  }

  public navigateToSignIn(): void {
    this.activeModal.dismissAll();  
    if(location.pathname === "/b2c/signup"){
      this.router.navigateByUrl("b2c/signin");
     }else{
      this.modal = this.modalService.open(B2bSignInComponent);
     }
  }
}
