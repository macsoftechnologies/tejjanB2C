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
  countries : any;
  profileForm : FormGroup;
  public gender = [ "Male", "Female", "Others" ];
  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private tejaanServices: AlrajhiumrahService) {}

  ngOnInit() {
    this.loadProfileForm();
    this.getCountries();
  }

  //  ***** ProfileForm controls Declaration *********

  loadProfileForm() {
    this.profileForm = this.formBuilder.group({
      firstName : [''],
      lastName : [''],
      userName : [''],
      email : [''],
      gender : [''],
      phone : [''],
      dateofbirth : [''],
      country : [''],
      travelCountry : [''],
      password : ['']
    });
  }
   //  ****** Get countries List *****

   public getCountries(): void {
    this.tejaanServices.getCountyList().subscribe((data) => {
      this.countries = data;
      // console.log("countries List---" , this.countries);
    });
  }
}
