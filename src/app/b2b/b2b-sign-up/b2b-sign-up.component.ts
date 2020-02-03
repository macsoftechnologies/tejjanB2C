import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlrajhiumrahService } from 'src/app/services/alrajhiumrah.service';
import { BroadcastserviceService } from 'src/app/services/broadcastservice.service';

@Component({
  selector: "app-b2b-sign-up",
  templateUrl: "./b2b-sign-up.component.html",
  styleUrls: ["./b2b-sign-up.component.scss"]
})
export class B2bSignUpComponent implements OnInit {
  signupForm: FormGroup;
  countries : any;
  user: any;
  signUpValidationFlag: boolean;

  public surName = [ "Mr", "Mrs", "Miss" ];
  registrationResp: any;
  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private tejaanServices: AlrajhiumrahService,
              private broadcastservice: BroadcastserviceService) {}

  ngOnInit() {
    this.loadSignupForm();
    this.getCountries();
  }

  // **** Signup From Declarations ****
  loadSignupForm() {
    this.signupForm = this.formBuilder.group({
      companyName: ['',Validators.required],
      fullName: ['',Validators.required],
      surName:['',Validators.required],
      ibanNumber: ['',Validators.required],
      email: ['',Validators.required],
      userName: ['',Validators.required],
      country: ['',Validators.required],
      phoneNumber: ['',Validators.required],
      password: ['',Validators.required],
      confirmPasswd: ['',Validators.required]
    });
  }

  signUp() {
    this.signUpValidationFlag = this.signupForm.valid ? false : true ; 

    let userData = {
      name: "abcd",
      address: "vizag"
    }
    localStorage.setItem('userData', JSON.stringify(userData));
    this.user = localStorage.getItem('userData');
    if(this.user == null && this.user == undefined) {
      this.broadcastservice.showHideLogin.emit(false);
    }
    else {
      
    }

    if( !this.signUpValidationFlag ) {
      
    let signUpObj = {
      type: "B2B",
      companyName: this.signupForm.value.companyName,
      fullName: this.signupForm.value.fullName,
      surName: this.signupForm.value.surName,
      ibanNumber: this.signupForm.value.ibanNumber,
      email: this.signupForm.value.email,
      userName: this.signupForm.value.userName,
      country: this.signupForm.value.country.countryName,
      phoneNumber: this.signupForm.value.phoneNumber,
      password: this.signupForm.value.password
    }

    this.tejaanServices.registration(signUpObj).subscribe(data => {
      this.registrationResp = data;
      console.log("registrationResp" , this.registrationResp);
    });
    console.log("SignUpObj ===",signUpObj );
    }

  }
  //  ****** Get countries List *****

  public getCountries(): void {
    this.tejaanServices.getCountyList().subscribe((data) => {
      this.countries = data;
      // console.log("countries List---" , this.countries);
    });
  }
}
