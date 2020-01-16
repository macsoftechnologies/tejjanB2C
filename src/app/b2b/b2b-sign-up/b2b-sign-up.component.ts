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

  public surName = [ "Sk" , "Md" ];
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
      fullName: [''],
      surName:[''],
      ibanNumber: [''],
      email: [''],
      userName: [''],
      country: [''],
      phoneNumber: [''],
      password: [''],
      confirmPasswd: ['']
    });
  }

  signUp() {
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
  }
  //  ****** Get countries List *****

  public getCountries(): void {
    this.tejaanServices.getCountyList().subscribe((data) => {
      this.countries = data;
      // console.log("countries List---" , this.countries);
    });
  }
}
