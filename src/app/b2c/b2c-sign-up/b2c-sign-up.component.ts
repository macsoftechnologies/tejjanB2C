import { Component, OnInit } from "@angular/core";

import { AlrajhiumrahService } from "../../services/alrajhiumrah.service";
import { Router } from '@angular/router';
import { BroadcastserviceService } from 'src/app/services/broadcastservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: "app-b2c-sign-up",
  templateUrl: "./b2c-sign-up.component.html",
  styleUrls: ["./b2c-sign-up.component.scss"]
})
export class B2cSignUpComponent implements OnInit {
  signupForm: FormGroup;
  countries: any;
  signUpValidationFlag : boolean;

  constructor(private tejaanServices: AlrajhiumrahService,
    private formBuilder: FormBuilder,
    private router:Router,
    private broadcastservice: BroadcastserviceService
    ) {
     
    }

  ngOnInit() {
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
      console.log("signUpObj====" , signUpObj);
      this.router.navigateByUrl("b2c/signin");
    }
  }
}
