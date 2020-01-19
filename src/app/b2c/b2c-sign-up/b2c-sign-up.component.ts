import { Component, OnInit } from "@angular/core";

import { AlrajhiumrahService } from "../../services/alrajhiumrah.service";
import { Router } from '@angular/router';
import { BroadcastserviceService } from 'src/app/services/broadcastservice.service';

@Component({
  selector: "app-b2c-sign-up",
  templateUrl: "./b2c-sign-up.component.html",
  styleUrls: ["./b2c-sign-up.component.scss"]
})
export class B2cSignUpComponent implements OnInit {
  countries: any;

  constructor(private tejaanServices: AlrajhiumrahService,
    private router:Router,
    private broadcastservice: BroadcastserviceService
    ) {
     
    }

  ngOnInit() {
    console.log("sinup constructor");
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

  public navigateToSinin():void{
    this.router.navigateByUrl("b2c/signin");
  }
}
