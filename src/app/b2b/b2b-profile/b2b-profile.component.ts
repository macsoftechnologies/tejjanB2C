import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlrajhiumrahService } from 'src/app/services/alrajhiumrah.service';

@Component({
  selector: "app-b2b-profile",
  templateUrl: "./b2b-profile.component.html",
  styleUrls: ["./b2b-profile.component.scss"]
})
export class B2bProfileComponent implements OnInit {

  countries: any;
  user: any
  userProfile: any
  profileForm: FormGroup;
 
  public gender = [ "Male", "Female", "Others" ];
  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private tejaanServices: AlrajhiumrahService) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('userData'))
    this.getprofile()
    this.getCountries();
      this.loadProfileForm();
  }

  //  ***** ProfileForm controls Declaration *********

  loadProfileForm() {
    this.profileForm = this.formBuilder.group({
      fullName: [''],
      userName: [''],
      ibanNumber: [''],
      email: [''],
      gender: [''],
      phone: [''],
      companyName: [''],
      country: [''],
      // travelCountry : [''],
      password: ['']
    });

  }

  updateForm() {


    this.profileForm.patchValue({


      fullName: this.userProfile.fullName,
      userName: this.userProfile.userName,
      ibanNumber: this.userProfile.ibanNumber,
      email: this.userProfile.email,
      // gender : this.userProfile.fullName,
      phone: this.userProfile.phoneNumber,
      companyName: this.userProfile.companyName,
      country: this.userProfile.country,
      // travelCountry : [''],
      password: this.userProfile.password



    })


  }
  //  ****** Get countries List *****

  public getCountries(): void {
    this.tejaanServices.getCountyList().subscribe((data) => {
      this.countries = data;
      // console.log("countries List---" , this.countries);
    });
  }


  public getprofile() {

    let userObj = {
      user_name: this.user.userName
    }

    this.tejaanServices.getUserProfile(userObj).subscribe(resp => {

      this.userProfile = resp
      // this.loadProfileForm();
      this.updateForm()


    })

  }
}
